import { IsString, IsEnum, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReminderType } from '@prisma/client';

export class CreateReminderDto {
  @IsString()
  @ApiProperty({ example: 'Take Medication' })
  title: string;

  @IsEnum(ReminderType)
  @ApiProperty({ enum: ReminderType, example: 'MEDICATION' })
  type: ReminderType;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Take 2 pills', required: false })
  description?: string;

  @IsDateString()
  @ApiProperty({ example: '2023-12-25T08:00:00Z' })
  time: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, default: false })
  recurring?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Daily', required: false })
  frequency?: string;
}

export class UpdateReminderDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  title?: string;

  @IsOptional()
  @IsEnum(ReminderType)
  @ApiProperty({ enum: ReminderType, required: false })
  type?: ReminderType;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  time?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  recurring?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  frequency?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  isActive?: boolean;
}
