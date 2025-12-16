import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGoalDto {
  @ApiProperty({ example: 'Exercise regularly' })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'Exercise at least 3 times per week',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: ['MENTAL_HEALTH', 'PHYSICAL_HEALTH', 'SOCIAL', 'CAREER', 'OTHER'],
    example: 'PHYSICAL_HEALTH',
  })
  @IsEnum(['MENTAL_HEALTH', 'PHYSICAL_HEALTH', 'SOCIAL', 'CAREER', 'OTHER'])
  category: string;

  @ApiProperty({ example: '2024-12-31' })
  @IsDateString()
  targetDate: string;

  @ApiPropertyOptional({
    enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED'],
    example: 'NOT_STARTED',
    default: 'NOT_STARTED',
  })
  @IsOptional()
  @IsEnum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED'])
  status?: string;

  @ApiPropertyOptional({
    example: ['task1', 'task2'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  milestones?: string[];
}
