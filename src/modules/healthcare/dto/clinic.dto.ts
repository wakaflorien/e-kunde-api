import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsObject,
  Min,
} from 'class-validator';

export class CreateClinicProfileDto {
  @ApiProperty({ example: 'Mental Wellness Clinic' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'A leading mental health facility in Kigali...',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 'KG 123 St, Kigali' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Kigali' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Rwanda' })
  @IsString()
  country: string;

  @ApiProperty({ example: '+250788123456' })
  @IsString()
  contactPhone: string;

  @ApiProperty({ example: 'info@mentalwellness.rw' })
  @IsString()
  contactEmail: string;

  @ApiPropertyOptional({ example: 'https://mentalwellness.rw' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({
    example: [
      'Individual Therapy',
      'Group Therapy',
      'Family Counseling',
      'Psychiatric Evaluation',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  servicesOffered?: string[];

  @ApiPropertyOptional({
    example: [
      'Private Consultation Rooms',
      'Waiting Area',
      'Wheelchair Access',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  facilities?: string[];

  @ApiPropertyOptional({
    example: {
      monday: '08:00-17:00',
      tuesday: '08:00-17:00',
      closed: ['Sunday'],
    },
  })
  @IsOptional()
  @IsObject()
  operatingHours?: Record<string, string>;

  @ApiPropertyOptional({ example: 'CLINIC-LICENSE-2024-001' })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({ example: '2030-12-31' })
  @IsOptional()
  @IsString()
  licenseExpiry?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;
}

export class UpdateClinicProfileDto {
  @ApiPropertyOptional({ example: 'Mental Wellness Clinic' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'A leading mental health facility in Kigali...',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'KG 123 St, Kigali' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Kigali' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Rwanda' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: '+250788123456' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ example: 'info@mentalwellness.rw' })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional({ example: 'https://mentalwellness.rw' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({
    example: [
      'Individual Therapy',
      'Group Therapy',
      'Family Counseling',
      'Psychiatric Evaluation',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  servicesOffered?: string[];

  @ApiPropertyOptional({
    example: [
      'Private Consultation Rooms',
      'Waiting Area',
      'Wheelchair Access',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  facilities?: string[];

  @ApiPropertyOptional({
    example: {
      monday: '08:00-17:00',
      tuesday: '08:00-17:00',
      closed: ['Sunday'],
    },
  })
  @IsOptional()
  @IsObject()
  operatingHours?: Record<string, string>;

  @ApiPropertyOptional({ example: 'CLINIC-LICENSE-2024-001' })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({ example: '2030-12-31' })
  @IsOptional()
  @IsString()
  licenseExpiry?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;
}
