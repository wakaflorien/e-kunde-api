import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJournalDto {
  @ApiProperty({ example: 'My thoughts today' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Today was a challenging day...' })
  @IsString()
  content: string;

  @ApiProperty({
    enum: ['VERY_POOR', 'POOR', 'OKAY', 'GOOD', 'EXCELLENT'],
    example: 'GOOD',
  })
  @IsEnum(['VERY_POOR', 'POOR', 'OKAY', 'GOOD', 'EXCELLENT'])
  mood: string;

  @ApiPropertyOptional({
    example: ['Gratitude', 'Reflection'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    enum: ['PUBLIC', 'FRIENDS', 'PRIVATE'],
    example: 'PRIVATE',
    default: 'PRIVATE',
  })
  @IsOptional()
  @IsEnum(['PUBLIC', 'FRIENDS', 'PRIVATE'])
  visibility?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  anonymous?: boolean;
}
