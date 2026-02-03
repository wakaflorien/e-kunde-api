import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CreateCommunityDto,
  UpdateCommunityDto,
} from './dto/community.dto';

@ApiTags('Communities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('communities')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new community' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCommunityDto,
  ) {
    return this.communityService.createCommunity(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all public communities' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    return this.communityService.listCommunities({ page, limit, type, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get community details' })
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.communityService.getCommunityById(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update community' })
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateCommunityDto,
  ) {
    return this.communityService.updateCommunity(id, userId, dto);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join a community' })
  join(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.communityService.joinCommunity(id, userId);
  }

  @Delete(':id/leave')
  @ApiOperation({ summary: 'Leave a community' })
  leave(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.communityService.leaveCommunity(id, userId);
  }
}
