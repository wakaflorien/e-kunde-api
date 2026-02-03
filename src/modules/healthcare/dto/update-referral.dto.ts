import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ReferralStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  COMPLETED = 'COMPLETED',
}

export class UpdateReferralStatusDto {
  @ApiProperty({ enum: ReferralStatus })
  @IsEnum(ReferralStatus)
  status: ReferralStatus;

  @ApiProperty({ description: 'Notes on status change', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
