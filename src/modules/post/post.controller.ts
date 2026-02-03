import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CreatePostDto,
  UpdatePostDto,
  CreateCommentDto,
  ReactionDto,
} from './dto/post.dto';

@ApiTags('Posts & Social')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreatePostDto) {
    return this.postService.createPost(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get global feed' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('tag') tag?: string,
  ) {
    return this.postService.listPosts({ page, limit, tag });
  }

  @Get('community/:communityId')
  @ApiOperation({ summary: 'Get community feed' })
  findCommunityFeed(
    @Param('communityId') communityId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.postService.listPosts({ communityId, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post details' })
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.postService.getPostById(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update post' })
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postService.updatePost(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete post' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.postService.deletePost(id, userId);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a post' })
  addComment(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.postService.createComment(id, userId, dto);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get post comments' })
  getComments(@Param('id') id: string) {
    return this.postService.getComments(id);
  }

  @Post(':id/react')
  @ApiOperation({ summary: 'Toggle reaction on a post' })
  react(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ReactionDto,
  ) {
    return this.postService.toggleReaction(userId, {
      postId: id,
      type: dto.type,
    });
  }

  @Post('comments/:commentId/react')
  @ApiOperation({ summary: 'Toggle reaction on a comment' })
  reactToComment(
    @Param('commentId') commentId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ReactionDto,
  ) {
    return this.postService.toggleReaction(userId, {
      commentId,
      type: dto.type,
    });
  }
}
