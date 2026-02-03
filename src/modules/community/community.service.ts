import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateCommunityDto,
  UpdateCommunityDto,
} from './dto/community.dto';

@Injectable()
export class CommunityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new community
   */
  async createCommunity(userId: string, dto: CreateCommunityDto) {
    const community = await this.prisma.community.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type as any,
        icon: dto.icon,
        isPublic: dto.isPublic ?? true,
        allowAnonymous: dto.allowAnonymous ?? false,
        createdById: userId,
        clinicId: dto.clinicId,
        universityId: dto.universityId,
        ngoId: dto.ngoId,
        members: {
          create: {
            userId,
            role: 'admin',
          },
        },
      },
      include: {
        members: true,
      },
    });

    return community;
  }

  /**
   * List all public communities
   */
  async listCommunities(params: {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
  }) {
    const { page = 1, limit = 10, type, search } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      isPublic: true,
      ...(type && { type }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [total, items] = await Promise.all([
      this.prisma.community.count({ where }),
      this.prisma.community.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { members: true },
          },
        },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get community by ID with member info
   */
  async getCommunityById(id: string, userId?: string) {
    const community = await this.prisma.community.findUnique({
      where: { id },
      include: {
        _count: {
          select: { members: true, posts: true },
        },
        members: userId
          ? {
              where: { userId },
            }
          : false,
      },
    });

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    // If community is private, check if user is a member
    if (!community.isPublic && (!userId || community.members.length === 0)) {
      throw new ForbiddenException('This community is private');
    }

    return community;
  }

  /**
   * Update community
   */
  async updateCommunity(id: string, userId: string, dto: UpdateCommunityDto) {
    const community = await this.prisma.community.findUnique({
      where: { id },
      include: { members: { where: { userId, role: 'admin' } } },
    });

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    if (community.members.length === 0 && community.createdById !== userId) {
      throw new ForbiddenException('Not authorized to update this community');
    }

    return this.prisma.community.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description && { description: dto.description }),
        ...(dto.type && { type: dto.type as any }),
        ...(dto.icon && { icon: dto.icon }),
        ...(dto.isPublic !== undefined && { isPublic: dto.isPublic }),
        ...(dto.allowAnonymous !== undefined && {
          allowAnonymous: dto.allowAnonymous,
        }),
      },
    });
  }

  /**
   * Join a community
   */
  async joinCommunity(communityId: string, userId: string) {
    const community = await this.prisma.community.findUnique({
      where: { id: communityId },
    });

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    const existingMember = await this.prisma.communityMember.findUnique({
      where: {
        communityId_userId: { communityId, userId },
      },
    });

    if (existingMember) {
      throw new BadRequestException('You are already a member');
    }

    return this.prisma.communityMember.create({
      data: {
        communityId,
        userId,
        role: 'member',
      },
    });
  }

  /**
   * Leave a community
   */
  async leaveCommunity(communityId: string, userId: string) {
    const member = await this.prisma.communityMember.findUnique({
      where: {
        communityId_userId: { communityId, userId },
      },
    });

    if (!member) {
      throw new BadRequestException('You are not a member of this community');
    }

    if (member.role === 'admin') {
      const adminCount = await this.prisma.communityMember.count({
        where: { communityId, role: 'admin' },
      });

      if (adminCount === 1) {
        throw new BadRequestException(
          'Cannot leave as the last admin. Appoint another admin or delete the community.',
        );
      }
    }

    await this.prisma.communityMember.delete({
      where: {
        communityId_userId: { communityId, userId },
      },
    });

    return { message: 'Left community successfully' };
  }

  /**
   * Get member's role in a community
   */
  async getMemberRole(communityId: string, userId: string) {
    const member = await this.prisma.communityMember.findUnique({
      where: {
        communityId_userId: { communityId, userId },
      },
    });

    return member?.role || null;
  }
}
