import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateAvailabilityDto {
  @ApiProperty({ example: '2025-12-20' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '09:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '17:00' })
  @IsString()
  endTime: string;

  @ApiPropertyOptional({ example: ['10:00', '11:00', '14:00', '15:00'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  slots?: string[];
}

export class CreateSessionNoteDto {
  @ApiProperty({ example: 'session-uuid' })
  @IsString()
  sessionId: string;

  @ApiProperty({
    example: 'Patient showed improvement in managing anxiety...',
  })
  @IsString()
  notes: string;

  @ApiPropertyOptional({
    example: 'Continue CBT exercises, schedule follow-up',
  })
  @IsOptional()
  @IsString()
  recommendations?: string;

  @ApiPropertyOptional({ example: ['attachment1.pdf', 'attachment2.pdf'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}
