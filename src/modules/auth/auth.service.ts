import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import {
  RegisterDto,
  LoginDto,
  RequestOtpDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import { generateOTP, addMinutes, isExpired } from '../../common/utils';
import { JwtTokens } from '../../common/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Validate that at least email or phone is provided
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Email or phone number is required');
    }

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
      throw new ConflictException('User already exists with this credential');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create user with profile
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: 'PATIENT',
        status: 'PENDING_VERIFICATION',
        profile: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
          },
        },
        consentSettings: {
          create: {},
        },
      },
      include: {
        profile: true,
        consentSettings: true,
      },
    });

    // Generate tokens
    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    // Validate that at least email or phone is provided
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Email or phone number is required');
    }

    // Find user
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          dto.email ? { email: dto.email } : {},
          dto.phone ? { phone: dto.phone } : {},
        ].filter((condition) => Object.keys(condition).length > 0),
      },
      include: {
        profile: true,
        consentSettings: true,
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check account status
    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Account has been suspended');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    return this.generateTokens(user);
  }

  async requestOtp(dto: RequestOtpDto) {
    const identifier = dto.email || dto.phone;

    if (!identifier) {
      throw new BadRequestException('Email or phone number is required');
    }

    // Generate OTP
    const otp = generateOTP(6);
    const expiresAt = addMinutes(new Date(), 10); // OTP valid for 10 minutes

    // Save OTP to database
    await this.prisma.oTPVerification.create({
      data: {
        identifier,
        otp,
        expiresAt,
      },
    });

    // TODO: Send OTP via email or SMS based on method
    // For now, return OTP in development (remove in production)
    return {
      message: 'OTP sent successfully',
      ...(process.env.NODE_ENV === 'development' && { otp }), // Only in dev
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otpRecord = await this.prisma.oTPVerification.findFirst({
      where: {
        identifier: dto.identifier,
        otp: dto.otp,
        verified: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!otpRecord) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (isExpired(otpRecord.expiresAt)) {
      throw new UnauthorizedException('OTP has expired');
    }

    if (otpRecord.attempts >= 3) {
      throw new UnauthorizedException(
        'Too many attempts. Please request a new OTP',
      );
    }

    // Mark as verified
    await this.prisma.oTPVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Find or create user
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.identifier }, { phone: dto.identifier }],
      },
      include: {
        profile: true,
        consentSettings: true,
      },
    });

    if (!user) {
      // Create user if doesn't exist
      const isEmail = dto.identifier.includes('@');
      user = await this.prisma.user.create({
        data: {
          email: isEmail ? dto.identifier : undefined,
          phone: !isEmail ? dto.identifier : undefined,
          emailVerified: isEmail,
          phoneVerified: !isEmail,
          role: 'PATIENT',
          status: 'ACTIVE',
          profile: {
            create: {},
          },
          consentSettings: {
            create: {},
          },
        },
        include: {
          profile: true,
          consentSettings: true,
        },
      });
    } else {
      // Update verification status
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: dto.identifier.includes('@')
            ? true
            : user.emailVerified,
          phoneVerified: !dto.identifier.includes('@')
            ? true
            : user.phoneVerified,
          status: 'ACTIVE',
        },
      });
    }

    // Generate tokens
    return this.generateTokens(user);
  }

  private async generateTokens(user: any): Promise<JwtTokens> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      user: this.sanitizeUser(user),
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET') || 'your-secret-key',
      expiresIn: '1d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get('JWT_REFRESH_SECRET') || 'your-refresh-secret',
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
