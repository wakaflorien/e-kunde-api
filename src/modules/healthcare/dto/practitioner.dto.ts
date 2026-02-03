import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class CreatePractitionerProfileDto {
  @ApiProperty({ example: 'Clinical Psychologist' })
  @IsString()
  title: string;

  @ApiProperty({
    example: ['Anxiety', 'Depression', 'Trauma', 'Relationship Issues'],
  })
  @IsArray()
  @IsString({ each: true })
  specializations: string[];

  @ApiProperty({
    example: ['PhD in Clinical Psychology', 'Licensed Therapist'],
  })
  @IsArray()
  @IsString({ each: true })
  qualifications: string[];

  @ApiProperty({
    example:
      'Experienced therapist with 10 years in cognitive behavioral therapy...',
  })
  @IsString()
  bio: string;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  yearsOfExperience?: number;

  @ApiPropertyOptional({ example: ['English', 'Kinyarwanda', 'French'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languagesSpoken?: string[];

  @ApiPropertyOptional({ example: 50000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  consultationFee?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  acceptingNewPatients?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/license.pdf' })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({ example: '2030-12-31' })
  @IsOptional()
  @IsString()
  licenseExpiry?: string;
}

export class UpdatePractitionerProfileDto {
  @ApiPropertyOptional({ example: 'Clinical Psychologist' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: ['Anxiety', 'Depression', 'Trauma', 'Relationship Issues'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];

  @ApiPropertyOptional({
    example: ['PhD in Clinical Psychology', 'Licensed Therapist'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  qualifications?: string[];

  @ApiPropertyOptional({
    example:
      'Experienced therapist with 10 years in cognitive behavioral therapy...',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  yearsOfExperience?: number;

  @ApiPropertyOptional({ example: ['English', 'Kinyarwanda', 'French'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languagesSpoken?: string[];

  @ApiPropertyOptional({ example: 50000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  consultationFee?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  acceptingNewPatients?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/license.pdf' })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({ example: '2030-12-31' })
  @IsOptional()
  @IsString()
  licenseExpiry?: string;
}
