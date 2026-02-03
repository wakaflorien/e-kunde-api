import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreatePostDto,
  UpdatePostDto,
  CreateCommentDto,
  ReactionDto,
} from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new post
   */
  async createPost(userId: string, dto: CreatePostDto) {
    // If communityId is provided, check if user is a member
    if (dto.communityId) {
      const member = await this.prisma.communityMember.findUnique({
        where: {
          communityId_userId: {
            communityId: dto.communityId,
            userId,
          },
        },
      });

      if (!member) {
        throw new ForbiddenException('You must be a member to post in this community');
      }
    }

    return this.prisma.post.create({
      data: {
        userId,
        communityId: dto.communityId,
        title: dto.title,
        content: dto.content,
        visibility: dto.visibility as any,
        isAnonymous: dto.isAnonymous ?? false,
        mediaUrls: dto.mediaUrls || [],
        tags: dto.tags || [],
      },
    });
  }

  /**
   * Get post by ID
   */
  async getPostById(id: string, userId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: { comments: true, reactions: true },
        },
        reactions: userId ? { where: { userId } } : false,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Hide user info if anonymous
    if (post.isAnonymous) {
      post.user = null as any;
    }

    return post;
  }

  /**
   * List posts (Feed)
   */
  async listPosts(params: {
    communityId?: string;
    userId?: string;
    page?: number;
    limit?: number;
    tag?: string;
  }) {
    const { communityId, userId, page = 1, limit = 10, tag } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'APPROVED',
      ...(communityId && { communityId }),
      ...(userId && { userId }),
      ...(tag && { tags: { has: tag } }),
      // Only show public or community posts
      ...(communityId ? {} : { visibility: 'PUBLIC' }),
    };

    const [total, items] = await Promise.all([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
          _count: {
            select: { comments: true, reactions: true },
          },
        },
      }),
    ]);

    // Handle anonymity
    const sanitizedItems = items.map((item) => {
      if (item.isAnonymous) {
        return { ...item, user: null };
      }
      return item;
    });

    return {
      items: sanitizedItems,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update post
   */
  async updatePost(id: string, userId: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('Not authorized to update this post');
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.content && { content: dto.content }),
        ...(dto.visibility && { visibility: dto.visibility as any }),
        ...(dto.isAnonymous !== undefined && { isAnonymous: dto.isAnonymous }),
        ...(dto.mediaUrls && { mediaUrls: dto.mediaUrls }),
        ...(dto.tags && { tags: dto.tags }),
      },
    });
  }

  /**
   * Delete post
   */
  async deletePost(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('Not authorized to delete this post');
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return { message: 'Post deleted successfully' };
  }

  /**
   * Add a comment
   */
  async createComment(postId: string, userId: string, dto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.prisma.comment.create({
      data: {
        postId,
        userId,
        parentId: dto.parentId,
        text: dto.text,
        isAnonymous: dto.isAnonymous ?? false,
      },
    });
  }

  /**
   * Get comments for a post
   */
  async getComments(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId, parentId: null }, // Get top-level comments
      include: {
        user: {
          select: {
            id: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: { reactions: true },
        },
        // Optionally include replies
        // children: { include: { ... } }
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Toggle reaction
   */
  async toggleReaction(
    userId: string,
    params: { postId?: string; commentId?: string; type: string },
  ) {
    const { postId, commentId, type } = params;

    const where: any = {
      userId,
      type: type as any,
      ...(postId && { postId }),
      ...(commentId && { commentId }),
    };

    const existing = await this.prisma.reaction.findFirst({
      where,
    });

    if (existing) {
      await this.prisma.reaction.delete({
        where: { id: existing.id },
      });
      return { action: 'removed' };
    } else {
      await this.prisma.reaction.create({
        data: {
          userId,
          type: type as any,
          postId,
          commentId,
        },
      });
      return { action: 'added' };
    }
  }
}
