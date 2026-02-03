import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationParams } from '../../common/interfaces/common.interface';
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

@Injectable()
export class HealthcareService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create or update practitioner profile
   */
  async createPractitionerProfile(
    userId: string,
    dto: CreatePractitionerProfileDto,
  ) {
    // Check if user is a practitioner
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'PRACTITIONER') {
      throw new ForbiddenException('Only practitioners can create a profile');
    }

    // Check if profile already exists
    const existing = await this.prisma.practitionerProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException(
        'Practitioner profile already exists. Use update endpoint.',
      );
    }

    return this.prisma.practitionerProfile.create({
      data: {
        userId,
        title: dto.title,
        specialization: dto.specializations || [],
        bio: dto.bio,
        yearsOfExperience: dto.yearsOfExperience,
        languages: dto.languagesSpoken || [],
        consultationFee: dto.consultationFee,
        licenseNumber: dto.licenseNumber,
        licenseExpiry: dto.licenseExpiry ? new Date(dto.licenseExpiry) : undefined,
        acceptingNewPatients: dto.acceptingNewPatients ?? true,
        education: dto.qualifications
          ? { qualifications: dto.qualifications }
          : undefined,
      },
    });
  }

  /**
   * Update practitioner profile
   */
  async updatePractitionerProfile(
    userId: string,
    dto: UpdatePractitionerProfileDto,
  ) {
    const profile = await this.prisma.practitionerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Practitioner profile not found');
    }

    return this.prisma.practitionerProfile.update({
      where: { userId },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.specializations && { specialization: dto.specializations }),
        ...(dto.bio && { bio: dto.bio }),
        ...(dto.yearsOfExperience !== undefined && {
          yearsOfExperience: dto.yearsOfExperience,
        }),
        ...(dto.languagesSpoken && { languages: dto.languagesSpoken }),
        ...(dto.consultationFee !== undefined && {
          consultationFee: dto.consultationFee,
        }),
        ...(dto.licenseNumber && { licenseNumber: dto.licenseNumber }),
        ...(dto.licenseExpiry && {
          licenseExpiry: new Date(dto.licenseExpiry),
        }),
        ...(dto.acceptingNewPatients !== undefined && {
          acceptingNewPatients: dto.acceptingNewPatients,
        }),
        ...(dto.qualifications && {
          education: { qualifications: dto.qualifications },
        }),
      },
    });
  }

  /**
   * Get practitioner profile
   */
  async getPractitionerProfile(userId: string) {
    const profile = await this.prisma.practitionerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            profile: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Practitioner profile not found');
    }

    return profile;
  }

  /**
   * List all practitioners
   */
  async listPractitioners(
    params: PaginationParams & { specialization?: string },
  ) {
    const { page = 1, limit = 10, specialization } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(specialization && {
        specializations: { has: specialization },
      }),
    };

    const [practitioners, total] = await Promise.all([
      this.prisma.practitionerProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.practitionerProfile.count({ where }),
    ]);

    return {
      data: practitioners,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create or update clinic profile
   */
  async createClinicProfile(userId: string, dto: CreateClinicProfileDto) {
    // Check if user is a clinic
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'CLINIC_ADMIN') {
      throw new ForbiddenException('Only clinics can create a profile');
    }

    // Check if profile already exists
    const existing = await this.prisma.clinicProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException(
        'Clinic profile already exists. Use update endpoint.',
      );
    }

    return this.prisma.clinicProfile.create({
      data: {
        userId,
        name: dto.name,
        description: dto.description,
        address: dto.address,
        city: dto.city,
        country: dto.country,
        phone: dto.contactPhone,
        email: dto.contactEmail,
        website: dto.website,
        workingHours: dto.operatingHours as any,
        specializations: dto.servicesOffered || [],
        facilities: dto.facilities || [],
        licenseNumber: dto.licenseNumber,
        licenseExpiry: dto.licenseExpiry ? new Date(dto.licenseExpiry) : undefined,
        capacity: dto.capacity,
      },
    });
  }

  /**
   * Update clinic profile
   */
  async updateClinicProfile(userId: string, dto: UpdateClinicProfileDto) {
    const profile = await this.prisma.clinicProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Clinic profile not found');
    }

    return this.prisma.clinicProfile.update({
      where: { userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description && { description: dto.description }),
        ...(dto.address && { address: dto.address }),
        ...(dto.city && { city: dto.city }),
        ...(dto.country && { country: dto.country }),
        ...(dto.contactPhone && { contactPhone: dto.contactPhone }),
        ...(dto.contactEmail && { contactEmail: dto.contactEmail }),
        ...(dto.website && { website: dto.website }),
        ...(dto.servicesOffered && { servicesOffered: dto.servicesOffered }),
        ...(dto.facilities && { facilities: dto.facilities }),
        ...(dto.operatingHours && {
          operatingHours: dto.operatingHours as any,
        }),
        ...(dto.licenseNumber && { licenseNumber: dto.licenseNumber }),
        ...(dto.licenseExpiry && {
          licenseExpiry: new Date(dto.licenseExpiry),
        }),
        ...(dto.capacity !== undefined && { capacity: dto.capacity }),
      },
    });
  }

  /**
   * Get clinic profile
   */
  async getClinicProfile(userId: string) {
    const profile = await this.prisma.clinicProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Clinic profile not found');
    }

    return profile;
  }

  /**
   * Create a booking
   */
  async createBooking(patientId: string, dto: CreateBookingDto) {
    // Verify practitioner exists
    const practitioner = await this.prisma.practitionerProfile.findUnique({
      where: { userId: dto.practitionerId },
    });

    if (!practitioner) {
      throw new NotFoundException('Practitioner not found');
    }

    // Verify clinic if provided
    if (dto.clinicId) {
      const clinic = await this.prisma.clinicProfile.findUnique({
        where: { userId: dto.clinicId },
      });

      if (!clinic) {
        throw new NotFoundException('Clinic not found');
      }
    }

    return this.prisma.booking.create({
      data: {
        patientId,
        practitionerId: dto.practitionerId,
        clinicId: dto.clinicId,
        scheduledAt: new Date(dto.scheduledAt),
        sessionType: dto.sessionType as any,
        duration: dto.duration || 60,
        notes: dto.notes,
        status: 'PENDING',
      },
      include: {
        practitioner: true,
        clinic: true,
      },
    });
  }

  /**
   * Get bookings for a user
   */
  async getBookings(
    userId: string,
    userRole: string,
    params: PaginationParams & { status?: string },
  ) {
    const { page = 1, limit = 10, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(status && { status }),
      ...(userRole === 'PATIENT'
        ? { patientId: userId }
        : { practitionerId: userId }),
    };

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: {
            select: {
              id: true,
              email: true,
              profile: true,
            },
          },
          practitioner: {
            select: {
              id: true,
              userId: true,
              specialization: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          clinic: true,
        },
        orderBy: {
          scheduledAt: 'desc',
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(
    bookingId: string,
    userId: string,
    userRole: string,
    dto: UpdateBookingStatusDto,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Only practitioner or patient can update booking
    if (booking.practitionerId !== userId && booking.patientId !== userId) {
      throw new ForbiddenException('Not authorized to update this booking');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: dto.status as any,
        cancellationReason: dto.cancellationReason,
      },
      include: {
        patient: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
        practitioner: {
          select: {
            id: true,
            userId: true,
            specialization: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Create a review
   */
  async createReview(patientId: string, dto: CreateReviewDto) {
    if (!dto.practitionerId && !dto.clinicId) {
      throw new BadRequestException(
        'Either practitionerId or clinicId must be provided',
      );
    }

    // Verify the patient had a completed booking
    if (dto.practitionerId) {
      const booking = await this.prisma.booking.findFirst({
        where: {
          patientId,
          practitionerId: dto.practitionerId,
          status: 'COMPLETED',
        },
      });

      if (!booking) {
        throw new BadRequestException(
          'You can only review practitioners you have had sessions with',
        );
      }
    }

    return this.prisma.review.create({
      data: {
        userId: patientId,
        practitionerId: dto.practitionerId,
        clinicId: dto.clinicId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  /**
   * Get reviews
   */
  async getReviews(
    params: PaginationParams & { practitionerId?: string; clinicId?: string },
  ) {
    const { page = 1, limit = 10, practitionerId, clinicId } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(practitionerId && { practitionerId }),
      ...(clinicId && { clinicId }),
    };

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
      data: reviews,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        averageRating: Number(avgRating.toFixed(1)),
      },
    };
  }

  /**
   * Create availability slots
   */
  async createAvailability(userId: string, dto: CreateAvailabilityDto) {
    const practitioner = await this.prisma.practitionerProfile.findUnique({
      where: { userId },
    });

    if (!practitioner) {
      throw new NotFoundException('Practitioner profile not found');
    }

    return this.prisma.availability.create({
      data: {
        practitionerId: practitioner.id,
        date: new Date(dto.date),
        startTime: dto.startTime,
        endTime: dto.endTime,
        slots: dto.slots || [],
      },
    });
  }

  /**
   * Get availability
   */
  async getAvailability(
    practitionerId: string,
    params: { startDate?: string; endDate?: string },
  ) {
    const where: any = {
      practitioner: {
        userId: practitionerId,
      },
      ...(params.startDate && {
        date: {
          gte: new Date(params.startDate),
        },
      }),
      ...(params.endDate && {
        date: {
          lte: new Date(params.endDate),
        },
      }),
    };

    return this.prisma.availability.findMany({
      where,
      orderBy: {
        date: 'asc',
      },
    });
  }

  /**
   * Delete availability
   */
  async deleteAvailability(availabilityId: string, userId: string) {
    const availability = await this.prisma.availability.findUnique({
      where: { id: availabilityId },
      include: { practitioner: true },
    });

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    if (availability.practitioner.userId !== userId) {
      throw new ForbiddenException(
        'Not authorized to delete this availability',
      );
    }

    await this.prisma.availability.delete({
      where: { id: availabilityId },
    });

    return { message: 'Availability deleted successfully' };
  }

  /**
   * Create session note
   */
  async createSessionNote(practitionerId: string, dto: CreateSessionNoteDto) {
    // Verify session exists and belongs to practitioner
    const session = await this.prisma.session.findUnique({
      where: { id: dto.sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.practitionerId !== practitionerId) {
      throw new ForbiddenException(
        'Not authorized to add notes to this session',
      );
    }

    return this.prisma.sessionNote.create({
      data: {
        sessionId: dto.sessionId,
        practitionerId,
        notes: dto.notes,
        aiSummary: dto.recommendations, // Map recommendations to aiSummary
        tags: dto.attachments || [], // Map attachments to tags
      },
    });
  }

  /**
   * Get session notes
   */
  async getSessionNotes(sessionId: string, userId: string, userRole: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        booking: true, // Need booking to get patientId
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Only practitioner and patient can view notes
    if (
      session.practitionerId !== userId &&
      session.booking.patientId !== userId
    ) {
      throw new ForbiddenException('Not authorized to view these notes');
    }

    return this.prisma.sessionNote.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
