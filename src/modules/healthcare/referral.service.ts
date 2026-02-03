import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReferralDto, ReferralPriority } from './dto/create-referral.dto';
import { UpdateReferralStatusDto, ReferralStatus } from './dto/update-referral.dto';
import { PaginationParams } from '../../common/interfaces';

@Injectable()
export class ReferralService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new referral
   */
  async createReferral(referrerId: string, dto: CreateReferralDto) {
    // Check if referrer is a practitioner
    const referrer = await this.prisma.user.findUnique({
      where: { id: referrerId },
    });

    if (!referrer) {
      throw new NotFoundException('Referrer not found');
    }

    if (referrer.role !== 'PRACTITIONER' && referrer.role !== 'CLINIC_STAFF') {
      throw new ForbiddenException('Only practitioners and staff can create referrals');
    }

    // Verify patient exists
    const patient = await this.prisma.user.findUnique({
      where: { id: dto.patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.prisma.referral.create({
      data: {
        referrerId,
        patientId: dto.patientId,
        targetId: dto.targetId,
        targetSpecialty: dto.targetSpecialty,
        reason: dto.reason,
        notes: dto.notes,
        priority: dto.priority || ReferralPriority.ROUTINE,
        status: ReferralStatus.PENDING,
      },
    });
  }

  /**
   * Get referrals (incoming or outgoing)
   */
  async getReferrals(userId: string, role: string, params: PaginationParams & { type?: 'sent' | 'received' }) {
    const { page = 1, limit = 10, type = 'received' } = params;
    const skip = (page - 1) * limit;

    let where: any = {};

    if (role === 'PATIENT') {
      // Patients see referrals where they are the patient
      where = { patientId: userId };
    } else {
      // Practitioners can see referrals they sent OR received (if targetId matches)
      // Complexity: targetId is just a string GUID, might refer to User.id or PractitionerProfile.userId?
      // For simplicity, assuming targetId is User.id of the target practitioner.
      
      if (type === 'sent') {
        where = { referrerId: userId };
      } else {
         // Received: either direct targetId match OR specialty match (future enhancement)
         where = { targetId: userId };
      }
    }

    const [referrals, total] = await Promise.all([
      this.prisma.referral.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: {
            select: {
              id: true,
              profile: { select: { firstName: true, lastName: true } }
            }
          },
          referrer: {
             select: {
              id: true,
              profile: { select: { firstName: true, lastName: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.referral.count({ where }),
    ]);

    return {
      data: referrals,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update referral status
   */
  async updateReferralStatus(referralId: string, userId: string, dto: UpdateReferralStatusDto) {
    const referral = await this.prisma.referral.findUnique({
      where: { id: referralId },
    });

    if (!referral) {
      throw new NotFoundException('Referral not found');
    }

    // Only target practitioner or admin can update status (simplification)
    // Or the patient can 'accept'/'decline'
    
    // Logic: Receiver updates to ACCEPTED/DECLINED.
    if (referral.targetId !== userId && referral.patientId !== userId) {
        // Allow referrer to cancel?
        if (referral.referrerId === userId && dto.status === ReferralStatus.DECLINED) {
            // Cancelled by referrer
        } else {
             throw new ForbiddenException('Not authorized to update this referral');
        }
    }

    return this.prisma.referral.update({
      where: { id: referralId },
      data: {
        status: dto.status,
        notes: dto.notes ? `${referral.notes || ''}\n[Update]: ${dto.notes}` : referral.notes,
      },
    });
  }

  /**
   * Get specific referral
   */
  async getReferral(id: string) {
      return this.prisma.referral.findUnique({
          where: { id },
          include: {
              patient: { include: { profile: true } },
              referrer: { include: { profile: true } },
          }
      })
  }
}
