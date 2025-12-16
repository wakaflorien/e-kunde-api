import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UpdateProfileDto } from './dto';
import * as bcrypt from 'bcrypt';
import { PaginationParams } from '../../common/interfaces';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new user
   */
  async create(dto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          dto.email ? { email: dto.email } : {},
          dto.phone ? { phone: dto.phone } : {},
        ].filter((condition) => Object.keys(condition).length > 0),
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or phone already exists',
      );
    }

    // Hash password if provided
    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await bcrypt.hash(dto.password, 10);
    }

    // Create user with profile
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: dto.role,
        emailVerified: dto.emailVerified ?? false,
        phoneVerified: dto.phoneVerified ?? false,
        status: 'ACTIVE',
        profile: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
          },
        },
        consentSettings: {
          create: {
            allowNotifications: true,
            allowAnonymousPosts: true,
          },
        },
      },
      include: {
        profile: true,
        consentSettings: true,
      },
    });

    return this.sanitizeUser(user);
  }

  /**
   * Find all users with pagination and filters
   */
  async findAll(params: PaginationParams & { role?: string; status?: string }) {
    const { page = 1, limit = 10, role, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(role && { role }),
      ...(status && { status }),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((user) => this.sanitizeUser(user)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find user by ID
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        consentSettings: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.sanitizeUser(user);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return this.sanitizeUser(user);
  }

  /**
   * Find user by phone
   */
  async findByPhone(phone: string) {
    const user = await this.prisma.user.findFirst({
      where: { phone },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with phone ${phone} not found`);
    }

    return this.sanitizeUser(user);
  }

  /**
   * Update user
   */
  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Hash password if being updated
    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.email && { email: dto.email }),
        ...(dto.phone && { phone: dto.phone }),
        ...(passwordHash && { passwordHash }),
        ...(dto.role && { role: dto.role as any }),
        ...(dto.status && { status: dto.status as any }),
        ...(dto.emailVerified !== undefined && {
          emailVerified: dto.emailVerified,
        }),
        ...(dto.phoneVerified !== undefined && {
          phoneVerified: dto.phoneVerified,
        }),
        ...(dto.twoFactorEnabled !== undefined && {
          twoFactorEnabled: dto.twoFactorEnabled,
        }),
        ...(dto.suspensionReason && { suspensionReason: dto.suspensionReason }),
        ...(dto.lastLoginAt && { lastLoginAt: new Date(dto.lastLoginAt) }),
      },
      include: {
        profile: true,
        consentSettings: true,
      },
    });

    return this.sanitizeUser(updated);
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!user.profile) {
      throw new BadRequestException('User profile does not exist');
    }

    const updated = await this.prisma.profile.update({
      where: { userId },
      data: {
        ...(dto.avatarUrl && { avatarUrl: dto.avatarUrl }),
        ...(dto.dateOfBirth && { dateOfBirth: new Date(dto.dateOfBirth) }),
        ...(dto.gender && { gender: dto.gender }),
        ...(dto.phoneNumber && { phoneNumber: dto.phoneNumber }),
        ...(dto.address && { address: dto.address }),
        ...(dto.city && { city: dto.city }),
        ...(dto.state && { state: dto.state }),
        ...(dto.country && { country: dto.country }),
        ...(dto.bio && { bio: dto.bio }),
        ...(dto.preferredLanguage && {
          preferredLanguage: dto.preferredLanguage,
        }),
        ...(dto.timezone && { timezone: dto.timezone }),
        ...(dto.mentalHealthConcerns && {
          mentalHealthConcerns: dto.mentalHealthConcerns,
        }),
        ...(dto.emergencyContactName && {
          emergencyContactName: dto.emergencyContactName,
        }),
        ...(dto.emergencyContactPhone && {
          emergencyContactPhone: dto.emergencyContactPhone,
        }),
        ...(dto.emergencyContactRelationship && {
          emergencyContactRelationship: dto.emergencyContactRelationship,
        }),
      },
    });

    return updated;
  }

  /**
   * Soft delete user
   */
  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        status: 'DEACTIVATED',
      },
    });

    return { message: 'User deleted successfully' };
  }

  /**
   * Search users
   */
  async search(query: string, params: PaginationParams) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          OR: [
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query } },
            {
              profile: {
                OR: [
                  { firstName: { contains: query, mode: 'insensitive' } },
                  { lastName: { contains: query, mode: 'insensitive' } },
                ],
              },
            },
          ],
          status: { not: 'DEACTIVATED' },
        },
        skip,
        take: limit,
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({
        where: {
          OR: [
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query } },
            {
              profile: {
                OR: [
                  { firstName: { contains: query, mode: 'insensitive' } },
                  { lastName: { contains: query, mode: 'insensitive' } },
                ],
              },
            },
          ],
          status: { not: 'DEACTIVATED' },
        },
      }),
    ]);

    return {
      data: users.map((user) => this.sanitizeUser(user)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Remove sensitive data from user object
   */
  private sanitizeUser(user: any) {
    const { passwordHash, refreshToken, twoFactorSecret, ...sanitized } = user;
    return sanitized;
  }
}
