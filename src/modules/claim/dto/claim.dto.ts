import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { ClaimStatus } from '@prisma/client';

export class CreateClaimDto {
  @ApiProperty({ example: 'booking-uuid' })
  @IsUUID()
  bookingId: string;

  @ApiProperty({ example: 'plan-uuid' })
  @IsUUID()
  planId: string;

  @ApiProperty({ example: 'provider-uuid' })
  @IsUUID()
  providerId: string;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  amountClaimed: number;

  @ApiPropertyOptional({ example: 'RWF' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 'Claim for therapy session' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateClaimStatusDto {
  @ApiProperty({ enum: ClaimStatus })
  @IsEnum(ClaimStatus)
  status: ClaimStatus;

  @ApiPropertyOptional({ example: 12000 })
  @IsOptional()
  @IsNumber()
  amountApproved?: number;

  @ApiPropertyOptional({ example: 'Incomplete documentation' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiPropertyOptional({ example: 'Processed by admin' })
  @IsOptional()
  @IsString()
  notes?: string;
}
