import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClaimService } from './claim.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateClaimDto, UpdateClaimStatusDto } from './dto/claim.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, ClaimStatus } from '@prisma/client';

@ApiTags('Claims')
@ApiBearerAuth()
@Roles(UserRole.PLATFORM_ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MODERATOR)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('claims')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post()
  @ApiOperation({ summary: 'Submit an insurance claim' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateClaimDto) {
    return this.claimService.createClaim(userId, dto);
  }

  @Get()
  @Roles(UserRole.PLATFORM_ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'List all claims (Admin/Moderator only)' })
  findAll(
    @Query('patientId') patientId?: string,
    @Query('providerId') providerId?: string,
    @Query('status') status?: ClaimStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.claimService.listClaims({
      patientId,
      providerId,
      status,
      page,
      limit,
    });
  }

  @Get('my-claims')
  @ApiOperation({ summary: 'Get current user claims' })
  findMyClaims(
    @CurrentUser('id') userId: string,
    @Query('status') status?: ClaimStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.claimService.listClaims({
      patientId: userId,
      status,
      page,
      limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get claim details' })
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string, @CurrentUser('role') role: string) {
    const isSpecialRole = role === UserRole.PLATFORM_ADMIN || role === UserRole.SYSTEM_ADMIN || role === UserRole.MODERATOR;
    return this.claimService.getClaimById(id, isSpecialRole ? undefined : userId);
  }

  @Patch(':id/status')
  @Roles(UserRole.PLATFORM_ADMIN, UserRole.SYSTEM_ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Update claim status (Admin/Moderator only)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateClaimStatusDto) {
    return this.claimService.updateStatus(id, dto);
  }
}
