import {
  IsEnum,
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCheckInDto {
  @ApiProperty({
    enum: ['VERY_POOR', 'POOR', 'OKAY', 'GOOD', 'EXCELLENT'],
    example: 'GOOD',
  })
  @IsEnum(['VERY_POOR', 'POOR', 'OKAY', 'GOOD', 'EXCELLENT'])
  mood: string;

  @ApiProperty({ example: 8, minimum: 1, maximum: 10 })
  @IsInt()
  @Min(1)
  @Max(10)
  moodScore: number;

  @ApiPropertyOptional({
    example: ['Anxious', 'Stressed'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  emotions?: string[];

  @ApiPropertyOptional({ example: 'Had a great day at work' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    example: ['Work', 'Family'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  triggers?: string[];

  @ApiPropertyOptional({ example: 7, minimum: 1, maximum: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  sleepHours?: number;

  @ApiPropertyOptional({
    enum: ['POOR', 'FAIR', 'GOOD', 'EXCELLENT'],
    example: 'GOOD',
  })
  @IsOptional()
  @IsEnum(['POOR', 'FAIR', 'GOOD', 'EXCELLENT'])
  sleepQuality?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsInt()
  @Min(0)
  exerciseMinutes?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  medicationTaken?: boolean;

  @ApiPropertyOptional({ example: 8, minimum: 1, maximum: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  anxietyLevel?: number;

  @ApiPropertyOptional({ example: 3, minimum: 1, maximum: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  stressLevel?: number;

  @ApiPropertyOptional({ example: 8, minimum: 1, maximum: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  energyLevel?: number;
}
