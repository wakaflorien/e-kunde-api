import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    enum: ['ACTIVE', 'SUSPENDED', 'DELETED', 'PENDING_VERIFICATION'],
    example: 'ACTIVE',
  })
  @IsOptional()
  @IsEnum(['ACTIVE', 'SUSPENDED', 'DELETED', 'PENDING_VERIFICATION'])
  status?: string;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  lastLoginAt?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;

  @ApiPropertyOptional({ example: 'Reason for suspension' })
  @IsOptional()
  @IsString()
  suspensionReason?: string;
}
