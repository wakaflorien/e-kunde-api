import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiPropertyOptional({ example: 'practitioner-uuid' })
  @IsOptional()
  @IsString()
  practitionerId?: string;

  @ApiPropertyOptional({ example: 'clinic-uuid' })
  @IsOptional()
  @IsString()
  clinicId?: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    example: 'Excellent therapist, very professional and understanding.',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
