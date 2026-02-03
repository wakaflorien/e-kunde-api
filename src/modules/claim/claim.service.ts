import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClaimDto, UpdateClaimStatusDto } from './dto/claim.dto';
import { ClaimStatus } from '@prisma/client';

@Injectable()
export class ClaimService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Submit an insurance claim for a booking
   */
  async createClaim(userId: string, dto: CreateClaimDto) {
    // Verify booking exists and belongs to the user
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.patientId !== userId) {
      throw new ForbiddenException('Not authorized to claim for this booking');
    }

    // Check if claim already exists
    const existing = await this.prisma.claim.findUnique({
      where: { bookingId: dto.bookingId },
    });

    if (existing) {
      throw new BadRequestException('A claim already exists for this booking');
    }

    // Verify user insurance plan
    const userInsurance = await this.prisma.userInsurance.findUnique({
      where: {
        userId_planId: { userId, planId: dto.planId },
      },
    });

    if (!userInsurance || !userInsurance.isActive) {
      throw new BadRequestException('Active insurance plan not found for this user');
    }

    return this.prisma.claim.create({
      data: {
        bookingId: dto.bookingId,
        patientId: userId,
        planId: dto.planId,
        providerId: dto.providerId,
        amountClaimed: dto.amountClaimed,
        currency: dto.currency || 'RWF',
        notes: dto.notes,
        status: ClaimStatus.PENDING,
      },
    });
  }

  /**
   * List claims with filters
   */
  async listClaims(params: {
    patientId?: string;
    providerId?: string;
    status?: ClaimStatus;
    page?: number;
    limit?: number;
  }) {
    const { patientId, providerId, status, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(patientId && { patientId }),
      ...(providerId && { providerId }),
      ...(status && { status }),
    };

    const [total, items] = await Promise.all([
      this.prisma.claim.count({ where }),
      this.prisma.claim.findMany({
        where,
        skip,
        take: limit,
        orderBy: { submittedAt: 'desc' },
        include: {
          patient: {
            select: {
              profile: {
                select: { firstName: true, lastName: true },
              },
            },
          },
          provider: true,
          plan: true,
          booking: true,
        },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update claim status (Admin/Moderator only)
   */
  async updateStatus(id: string, dto: UpdateClaimStatusDto) {
    const claim = await this.prisma.claim.findUnique({
      where: { id },
    });

    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    return this.prisma.claim.update({
      where: { id },
      data: {
        status: dto.status,
        amountApproved: dto.amountApproved ?? claim.amountApproved,
        rejectionReason: dto.rejectionReason,
        notes: dto.notes ? `${claim.notes}\nUpdate: ${dto.notes}` : claim.notes,
        processedAt: new Date(),
      },
    });
  }

  /**
   * Get claim details
   */
  async getClaimById(id: string, userId?: string) {
    const claim = await this.prisma.claim.findUnique({
      where: { id },
      include: {
        provider: true,
        plan: true,
        booking: true,
      },
    });

    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    if (userId && claim.patientId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    return claim;
  }
}
