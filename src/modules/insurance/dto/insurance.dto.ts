import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsUrl,
  IsBoolean,
  IsUUID,
  IsISO8601,
  IsObject,
} from 'class-validator';

export class CreateInsuranceProviderDto {
  @ApiProperty({ example: 'RSSB' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Rwanda Social Security Board' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ example: '+250 123 456 789' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'info@rssb.rw' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'https://rssb.rw' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}

export class UpdateInsuranceProviderDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}

export class CreateInsurancePlanDto {
  @ApiProperty({ example: 'provider-uuid' })
  @IsUUID()
  providerId: string;

  @ApiProperty({ example: 'Mutuelle de Santé' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Standard health insurance plan' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: { coPay: 200, outpatientLimit: 500000 } })
  @IsOptional()
  @IsObject()
  coverageDetails?: any;
}

export class UpdateInsurancePlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  coverageDetails?: any;
}

export class EnrollUserInsuranceDto {
  @ApiProperty({ example: 'plan-uuid' })
  @IsUUID()
  planId: string;

  @ApiProperty({ example: 'POLICY-123456' })
  @IsString()
  policyNumber: string;

  @ApiPropertyOptional({ example: '2026-12-31T00:00:00Z' })
  @IsOptional()
  @IsISO8601()
  expiryDate?: string;
}
