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
import { HealthcareService } from './healthcare.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  CreatePractitionerProfileDto,
  UpdatePractitionerProfileDto,
} from './dto/practitioner.dto';
import {
  CreateClinicProfileDto,
  UpdateClinicProfileDto,
} from './dto/clinic.dto';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
import { CreateReviewDto } from './dto/review.dto';
import {
  CreateAvailabilityDto,
  CreateSessionNoteDto,
} from './dto/availability.dto';

@ApiTags('Healthcare')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('healthcare')
export class HealthcareController {
  constructor(private readonly healthcareService: HealthcareService) {}

  // Practitioner Endpoints
  @Post('practitioners/profile')
  @Roles('PRACTITIONER')
  @ApiOperation({ summary: 'Create practitioner profile' })
  createPractitionerProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePractitionerProfileDto,
  ) {
    return this.healthcareService.createPractitionerProfile(userId, dto);
  }

  @Patch('practitioners/profile')
  @Roles('PRACTITIONER')
  @ApiOperation({ summary: 'Update practitioner profile' })
  updatePractitionerProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdatePractitionerProfileDto,
  ) {
    return this.healthcareService.updatePractitionerProfile(userId, dto);
  }

  @Get('practitioners/me')
  @Roles('PRACTITIONER')
  @ApiOperation({ summary: 'Get my practitioner profile' })
  getMyPractitionerProfile(@CurrentUser('id') userId: string) {
    return this.healthcareService.getPractitionerProfile(userId);
  }

  @Get('practitioners')
  @ApiOperation({ summary: 'List all practitioners' })
  listPractitioners(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('specialization') specialization?: string,
  ) {
    return this.healthcareService.listPractitioners({
      page,
      limit,
      specialization,
    });
  }

  // Clinic Endpoints
  @Post('clinics/profile')
  @Roles('CLINIC_ADMIN')
  @ApiOperation({ summary: 'Create clinic profile' })
  createClinicProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateClinicProfileDto,
  ) {
    return this.healthcareService.createClinicProfile(userId, dto);
  }

  @Patch('clinics/profile')
  @Roles('CLINIC_ADMIN')
  @ApiOperation({ summary: 'Update clinic profile' })
  updateClinicProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateClinicProfileDto,
  ) {
    return this.healthcareService.updateClinicProfile(userId, dto);
  }

  @Get('clinics/me')
  @Roles('CLINIC_ADMIN')
  @ApiOperation({ summary: 'Get my clinic profile' })
  getMyClinicProfile(@CurrentUser('id') userId: string) {
    return this.healthcareService.getClinicProfile(userId);
  }

  // Booking Endpoints
  @Post('bookings')
  @Roles('PATIENT')
  @ApiOperation({ summary: 'Create a booking' })
  createBooking(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateBookingDto,
  ) {
    return this.healthcareService.createBooking(userId, dto);
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Get my bookings' })
  getBookings(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.healthcareService.getBookings(userId, role, {
      page,
      limit,
      status,
    });
  }

  @Patch('bookings/:id/status')
  @ApiOperation({ summary: 'Update booking status' })
  updateBookingStatus(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.healthcareService.updateBookingStatus(id, userId, role, dto);
  }

  // Review Endpoints
  @Post('reviews')
  @Roles('PATIENT')
  @ApiOperation({ summary: 'Create a review' })
  createReview(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.healthcareService.createReview(userId, dto);
  }

  @Get('reviews')
  @ApiOperation({ summary: 'Get reviews' })
  getReviews(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('practitionerId') practitionerId?: string,
    @Query('clinicId') clinicId?: string,
  ) {
    return this.healthcareService.getReviews({
      page,
      limit,
      practitionerId,
      clinicId,
    });
  }

  // Availability Endpoints
  @Post('availability')
  @Roles('PRACTITIONER')
  @ApiOperation({ summary: 'Create availability slots' })
  createAvailability(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateAvailabilityDto,
  ) {
    return this.healthcareService.createAvailability(userId, dto);
  }

  @Get('availability/:practitionerId')
  @ApiOperation({ summary: 'Get practitioner availability' })
  getAvailability(
    @Param('practitionerId') practitionerId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.healthcareService.getAvailability(practitionerId, {
      startDate,
      endDate,
    });
  }

  @Delete('availability/:id')
  @Roles('PRACTITIONER')
  @ApiOperation({ summary: 'Delete availability' })
  deleteAvailability(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.healthcareService.deleteAvailability(id, userId);
  }

  // Session Notes Endpoints
  @Post('session-notes')
  @Roles('PRACTITIONER')
  @ApiOperation({ summary: 'Create session note' })
  createSessionNote(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSessionNoteDto,
  ) {
    return this.healthcareService.createSessionNote(userId, dto);
  }

  @Get('sessions/:sessionId/notes')
  @ApiOperation({ summary: 'Get session notes' })
  getSessionNotes(
    @Param('sessionId') sessionId: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.healthcareService.getSessionNotes(sessionId, userId, role);
  }
}
