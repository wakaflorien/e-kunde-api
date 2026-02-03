import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'practitioner-uuid' })
  @IsString()
  practitionerId: string;

  @ApiPropertyOptional({ example: 'clinic-uuid' })
  @IsOptional()
  @IsString()
  clinicId?: string;

  @ApiProperty({
    example: 'IN_PERSON',
    enum: ['IN_PERSON', 'VIDEO', 'AUDIO', 'PHONE'],
  })
  @IsString()
  sessionType: string;

  @ApiProperty({ example: '2025-12-20T10:00:00Z' })
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @IsOptional() // Make optional with a default in service if preferred
  duration?: number;

  @ApiPropertyOptional({ example: 'Initial consultation for anxiety issues' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateBookingStatusDto {
  @ApiProperty({
    example: 'CONFIRMED',
    enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED', 'NO_SHOW'],
  })
  @IsString()
  status: string;

  @ApiPropertyOptional({ example: 'Patient requested cancellation' })
  @IsOptional()
  @IsString()
  cancellationReason?: string;
}
