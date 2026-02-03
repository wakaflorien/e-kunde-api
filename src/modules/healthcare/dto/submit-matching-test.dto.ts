import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitMatchingTestDto {
    @ApiProperty({ description: 'List of symptoms or focus areas' })
    @IsArray()
    @IsString({ each: true })
    symptoms: string[];
    
    @ApiProperty({ description: 'Preferred languages', required: false })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    languages?: string[];
    
    @ApiProperty({ description: 'Preferred gender of practitioner', required: false })
    @IsString()
    @IsOptional()
    preferredGender?: string;

    @ApiProperty({ description: 'Maximum consultation fee', required: false })
    @IsOptional()
    maxFee?: number;
    
    @ApiProperty({ description: 'Additional preferences' })
    @IsObject()
    @IsOptional()
    preferences?: Record<string, any>;
}
