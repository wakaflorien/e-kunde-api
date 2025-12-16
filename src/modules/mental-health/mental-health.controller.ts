import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { MentalHealthService } from './mental-health.service';
import { CreateCheckInDto, CreateJournalDto, CreateGoalDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators';

@ApiTags('Mental Health')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mental-health')
export class MentalHealthController {
  constructor(private readonly mentalHealthService: MentalHealthService) {}

  // ============================================
  // CHECK-IN ENDPOINTS
  // ============================================

  @Post('check-ins')
  @ApiOperation({ summary: 'Create a new mood check-in' })
  @ApiResponse({ status: 201, description: 'Check-in created successfully' })
  async createCheckIn(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCheckInDto,
  ) {
    return this.mentalHealthService.createCheckIn(userId, dto);
  }

  @Get('check-ins')
  @ApiOperation({ summary: 'Get all check-ins for current user' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Check-ins retrieved successfully' })
  async getCheckIns(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.mentalHealthService.getUserCheckIns(userId, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
  }

  @Get('check-ins/stats')
  @ApiOperation({ summary: 'Get check-in statistics' })
  @ApiQuery({ name: 'days', required: false, example: 7 })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getCheckInStats(
    @CurrentUser('id') userId: string,
    @Query('days') days?: number,
  ) {
    return this.mentalHealthService.getCheckInStats(
      userId,
      days ? Number(days) : 7,
    );
  }

  // ============================================
  // JOURNAL ENDPOINTS
  // ============================================

  @Post('journals')
  @ApiOperation({ summary: 'Create a new journal entry' })
  @ApiResponse({ status: 201, description: 'Journal created successfully' })
  async createJournal(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateJournalDto,
  ) {
    return this.mentalHealthService.createJournal(userId, dto);
  }

  @Get('journals')
  @ApiOperation({ summary: 'Get all journals for current user' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Journals retrieved successfully' })
  async getJournals(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.mentalHealthService.getUserJournals(userId, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
  }

  @Get('journals/:id')
  @ApiOperation({ summary: 'Get journal by ID' })
  @ApiResponse({ status: 200, description: 'Journal retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Journal not found' })
  async getJournal(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.mentalHealthService.getJournal(id, userId);
  }

  @Delete('journals/:id')
  @ApiOperation({ summary: 'Delete journal' })
  @ApiResponse({ status: 200, description: 'Journal deleted successfully' })
  @ApiResponse({ status: 404, description: 'Journal not found' })
  async deleteJournal(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.mentalHealthService.deleteJournal(id, userId);
  }

  // ============================================
  // GOAL ENDPOINTS
  // ============================================

  @Post('goals')
  @ApiOperation({ summary: 'Create a new goal' })
  @ApiResponse({ status: 201, description: 'Goal created successfully' })
  async createGoal(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateGoalDto,
  ) {
    return this.mentalHealthService.createGoal(userId, dto);
  }

  @Get('goals')
  @ApiOperation({ summary: 'Get all goals for current user' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Goals retrieved successfully' })
  async getGoals(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.mentalHealthService.getUserGoals(userId, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
  }

  @Patch('goals/:id/progress')
  @ApiOperation({ summary: 'Update goal progress' })
  @ApiResponse({ status: 200, description: 'Progress updated successfully' })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  async updateGoalProgress(
    @Param('id') goalId: string,
    @CurrentUser('id') userId: string,
    @Body('progress') progress: number,
  ) {
    return this.mentalHealthService.updateGoalProgress(
      goalId,
      userId,
      progress,
    );
  }
}
