import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export enum CommunityType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  UNIVERSITY = 'UNIVERSITY',
  CLINIC = 'CLINIC',
  NGO = 'NGO',
}

export class CreateCommunityDto {
  @ApiProperty({ example: 'Mental Wellness Rwanda' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'A supportive community for those seeking mental wellness in Rwanda.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: CommunityType, example: CommunityType.PUBLIC })
  @IsEnum(CommunityType)
  type: CommunityType;

  @ApiPropertyOptional({ example: 'icon-url' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  allowAnonymous?: boolean;

  @ApiPropertyOptional({ example: 'clinic-uuid' })
  @IsOptional()
  @IsUUID()
  clinicId?: string;

  @ApiPropertyOptional({ example: 'university-uuid' })
  @IsOptional()
  @IsUUID()
  universityId?: string;

  @ApiPropertyOptional({ example: 'ngo-uuid' })
  @IsOptional()
  @IsUUID()
  ngoId?: string;
}

export class UpdateCommunityDto {
  @ApiPropertyOptional({ example: 'Updated Community Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: CommunityType })
  @IsOptional()
  @IsEnum(CommunityType)
  type?: CommunityType;

  @ApiPropertyOptional({ example: 'icon-url' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  allowAnonymous?: boolean;
}

export class JoinCommunityDto {
  @ApiProperty({ example: 'community-uuid' })
  @IsUUID()
  communityId: string;
}
