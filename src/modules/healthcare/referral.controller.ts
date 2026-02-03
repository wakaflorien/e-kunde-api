import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReferralService } from './referral.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralStatusDto } from './dto/update-referral.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators';

@ApiTags('Healthcare - Referrals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('healthcare/referrals')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new referral' })
  @ApiResponse({ status: 201, description: 'Referral created successfully' })
  async createReferral(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateReferralDto,
  ) {
    return this.referralService.createReferral(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get referrals' })
  @ApiQuery({ name: 'type', required: false, enum: ['sent', 'received'] })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getReferrals(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
    @Query('type') type?: 'sent' | 'received',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.referralService.getReferrals(userId, role, {
      type,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get referral details' })
  async getReferral(@Param('id') id: string) {
    return this.referralService.getReferral(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update referral status' })
  async updateReferralStatus(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateReferralStatusDto,
  ) {
    return this.referralService.updateReferralStatus(id, userId, dto);
  }
}
