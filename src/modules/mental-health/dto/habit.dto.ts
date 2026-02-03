import { IsString, IsEnum, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HabitType } from '@prisma/client';

export class CreateHabitDto {
  @IsString()
  @ApiProperty({ example: 'Drink Water' })
  name: string;

  @IsEnum(HabitType)
  @ApiProperty({ enum: HabitType, example: 'BUILD' })
  type: HabitType;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Drink 8 glasses of water daily', required: false })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Daily', required: false })
  targetFrequency?: string;
}

export class UpdateHabitDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Drink Water', required: false })
  name?: string;

  @IsOptional()
  @IsEnum(HabitType)
  @ApiProperty({ enum: HabitType, example: 'BUILD', required: false })
  type?: HabitType;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Description', required: false })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Daily', required: false })
  targetFrequency?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, required: false })
  isActive?: boolean;
}

export class LogHabitDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, required: false })
  completed?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Felt good', required: false })
  notes?: string;
}
