import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateInsuranceProviderDto,
  UpdateInsuranceProviderDto,
  CreateInsurancePlanDto,
  UpdateInsurancePlanDto,
  EnrollUserInsuranceDto,
} from './dto/insurance.dto';

@Injectable()
export class InsuranceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create an insurance provider
   */
  async createProvider(dto: CreateInsuranceProviderDto) {
    const existing = await this.prisma.insuranceProvider.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new BadRequestException('Insurance provider with this name already exists');
    }

    return this.prisma.insuranceProvider.create({
      data: dto as any,
    });
  }

  /**
   * List insurance providers
   */
  async listProviders() {
    return this.prisma.insuranceProvider.findMany({
      include: {
        _count: {
          select: { plans: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Create an insurance plan
   */
  async createPlan(dto: CreateInsurancePlanDto) {
    const provider = await this.prisma.insuranceProvider.findUnique({
      where: { id: dto.providerId },
    });

    if (!provider) {
      throw new NotFoundException('Insurance provider not found');
    }

    return this.prisma.insurancePlan.create({
      data: dto as any,
    });
  }

  /**
   * List plans for a provider
   */
  async listPlans(providerId: string) {
    return this.prisma.insurancePlan.findMany({
      where: { providerId },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Enroll a user in an insurance plan
   */
  async enrollUser(userId: string, dto: EnrollUserInsuranceDto) {
    const plan = await this.prisma.insurancePlan.findUnique({
      where: { id: dto.planId },
    });

    if (!plan) {
      throw new NotFoundException('Insurance plan not found');
    }

    const existing = await this.prisma.userInsurance.findUnique({
      where: {
        userId_planId: { userId, planId: dto.planId },
      },
    });

    if (existing) {
        return this.prisma.userInsurance.update({
            where: { id: existing.id },
            data: {
                policyNumber: dto.policyNumber,
                expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
                isActive: true,
            }
        });
    }

    return this.prisma.userInsurance.create({
      data: {
        userId,
        planId: dto.planId,
        policyNumber: dto.policyNumber,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
        isActive: true,
      },
    });
  }

  /**
   * Get user's active insurance policies
   */
  async getUserInsurances(userId: string) {
    return this.prisma.userInsurance.findMany({
      where: { userId, isActive: true },
      include: {
        plan: {
          include: {
            provider: true,
          },
        },
      },
    });
  }
}
