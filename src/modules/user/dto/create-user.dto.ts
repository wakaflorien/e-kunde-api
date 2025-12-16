import {
  IsEmail,
  IsString,
  IsOptional,
  IsPhoneNumber,
  IsEnum,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+254712345678' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional({ example: 'SecurePassword123!' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    enum: [
      'PATIENT',
      'CLINIC_ADMIN',
      'CLINIC_STAFF',
      'PRACTITIONER',
      'UNIVERSITY_ADMIN',
      'UNIVERSITY_COUNSELOR',
      'STUDENT_LEAD',
      'NGO_ADMIN',
      'NGO_STAFF',
      'DONOR',
    ],
    example: 'PATIENT',
  })
  @IsEnum([
    'PATIENT',
    'CLINIC_ADMIN',
    'CLINIC_STAFF',
    'PRACTITIONER',
    'UNIVERSITY_ADMIN',
    'UNIVERSITY_COUNSELOR',
    'STUDENT_LEAD',
    'NGO_ADMIN',
    'NGO_STAFF',
    'DONOR',
  ])
  role: UserRole;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  phoneVerified?: boolean;
}
