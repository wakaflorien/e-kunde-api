import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
  IsArray,
} from 'class-validator';

export enum ContentVisibility {
  PRIVATE = 'PRIVATE',
  ANONYMOUS = 'ANONYMOUS',
  PUBLIC = 'PUBLIC',
}

export enum ReactionType {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  SUPPORT = 'SUPPORT',
  INSPIRE = 'INSPIRE',
}

export class CreatePostDto {
  @ApiPropertyOptional({ example: 'community-uuid' })
  @IsOptional()
  @IsUUID()
  communityId?: string;

  @ApiPropertyOptional({ example: 'Post Title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'This is the content of the post.' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ enum: ContentVisibility, default: ContentVisibility.PUBLIC })
  @IsOptional()
  @IsEnum(ContentVisibility)
  visibility?: ContentVisibility;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiPropertyOptional({ example: ['url1', 'url2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaUrls?: string[];

  @ApiPropertyOptional({ example: ['mentalhealth', 'support'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdatePostDto {
  @ApiPropertyOptional({ example: 'Updated Title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated content.' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ enum: ContentVisibility })
  @IsOptional()
  @IsEnum(ContentVisibility)
  visibility?: ContentVisibility;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiPropertyOptional({ example: ['url1'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaUrls?: string[];

  @ApiPropertyOptional({ example: ['mentalhealth'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class CreateCommentDto {
  @ApiPropertyOptional({ example: 'comment-uuid' })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiProperty({ example: 'This is a comment.' })
  @IsString()
  text: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}

export class ReactionDto {
  @ApiProperty({ enum: ReactionType, example: ReactionType.LIKE })
  @IsEnum(ReactionType)
  type: ReactionType;
}
