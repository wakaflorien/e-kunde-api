import { IsNotEmpty, IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ReferralPriority {
  ROUTINE = 'ROUTINE',
  URGENT = 'URGENT',
  EMERGENCY = 'EMERGENCY',
}

export class CreateReferralDto {
  @ApiProperty({ description: 'ID of the patient being referred' })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ description: 'ID of the target practitioner (optional)', required: false })
  @IsUUID()
  @IsOptional()
  targetId?: string;

  @ApiProperty({ description: 'Specialty being referred to (optional)', required: false })
  @IsString()
  @IsOptional()
  targetSpecialty?: string;

  @ApiProperty({ description: 'Reason for referral' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ description: 'Clinical notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ enum: ReferralPriority, default: ReferralPriority.ROUTINE })
  @IsEnum(ReferralPriority)
  @IsOptional()
  priority?: ReferralPriority;
}
