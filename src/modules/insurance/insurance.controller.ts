import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InsuranceService } from './insurance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CreateInsuranceProviderDto,
  CreateInsurancePlanDto,
  EnrollUserInsuranceDto,
} from './dto/insurance.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Insurance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('insurance')
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Post('providers')
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Create an insurance provider (Admin only)' })
  createProvider(@Body() dto: CreateInsuranceProviderDto) {
    return this.insuranceService.createProvider(dto);
  }

  @Get('providers')
  @ApiOperation({ summary: 'List all insurance providers' })
  listProviders() {
    return this.insuranceService.listProviders();
  }

  @Post('plans')
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Create an insurance plan (Admin only)' })
  createPlan(@Body() dto: CreateInsurancePlanDto) {
    return this.insuranceService.createPlan(dto);
  }

  @Get('providers/:providerId/plans')
  @ApiOperation({ summary: 'List plans for a specific provider' })
  listPlans(@Param('providerId') providerId: string) {
    return this.insuranceService.listPlans(providerId);
  }

  @Post('enroll')
  @ApiOperation({ summary: 'Enroll current user in an insurance plan' })
  enroll(@CurrentUser('id') userId: string, @Body() dto: EnrollUserInsuranceDto) {
    return this.insuranceService.enrollUser(userId, dto);
  }

  @Get('my-insurance')
  @ApiOperation({ summary: 'Get current user active insurance' })
  getMyInsurance(@CurrentUser('id') userId: string) {
    return this.insuranceService.getUserInsurances(userId);
  }
}
