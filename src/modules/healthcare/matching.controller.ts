import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MatchingService } from './matching.service';
import { SubmitMatchingTestDto } from './dto/submit-matching-test.dto';
import { Request } from 'express';

// Temporary: Use standard guard but allow public route if creating separate public endpoint?
// Or make it protected for now as defined in Implementation Plan Phase 3.5

@ApiTags('Healthcare - Matching')
@Controller('healthcare/matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post()
  @ApiOperation({ summary: 'Submit matching test to find practitioners' })
  @ApiResponse({ status: 201, description: 'Matches returned successfully' })
  async submitTest(@Body() dto: SubmitMatchingTestDto) {
    // For now, allowing anonymous access strictly via logic (passing null userId)
    // In real app, might extract userId from token if present
    return this.matchingService.submitTest(null, dto); 
  }
}
