import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCheckInDto, CreateJournalDto, CreateGoalDto } from './dto';
import { PaginationParams } from '../../common/interfaces';

@Injectable()
export class MentalHealthService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // CHECK-IN METHODS
  // ============================================

  /**
   * Create a new check-in
   */
  async createCheckIn(userId: string, dto: CreateCheckInDto) {
    return this.prisma.checkIn.create({
      data: {
        userId,
        mood: dto.moodScore, // Map moodScore to mood (Int)
        emotions: dto.emotions,
        notes: dto.notes,
        stressLevel: dto.stressLevel,
        energyLevel: dto.energyLevel,
        sleepQuality: dto.sleepQuality ? parseInt(dto.sleepQuality) : undefined,
      },
    });
  }

  /**
   * Get user check-ins with pagination
   */
  async getUserCheckIns(userId: string, params: PaginationParams) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [checkIns, total] = await Promise.all([
      this.prisma.checkIn.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.checkIn.count({ where: { userId } }),
    ]);

    return {
      data: checkIns,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get check-in statistics
   */
  async getCheckInStats(userId: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const checkIns = await this.prisma.checkIn.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'asc' },
    });

    if (checkIns.length === 0) {
      return {
        averageMood: 0,
        averageStress: 0,
        averageEnergy: 0,
        totalCheckIns: 0,
        moodTrend: [],
      };
    }

    const averageMood =
      checkIns.reduce((sum, c) => sum + c.mood, 0) / checkIns.length;
    const averageStress =
      checkIns
        .filter((c) => c.stressLevel !== null)
        .reduce((sum, c) => sum + (c.stressLevel || 0), 0) /
        checkIns.filter((c) => c.stressLevel !== null).length || 0;
    const averageEnergy =
      checkIns
        .filter((c) => c.energyLevel !== null)
        .reduce((sum, c) => sum + (c.energyLevel || 0), 0) /
        checkIns.filter((c) => c.energyLevel !== null).length || 0;

    return {
      averageMood: Math.round(averageMood * 10) / 10,
      averageStress: Math.round(averageStress * 10) / 10,
      averageEnergy: Math.round(averageEnergy * 10) / 10,
      totalCheckIns: checkIns.length,
      moodTrend: checkIns.map((c) => ({
        date: c.createdAt,
        mood: c.mood,
      })),
    };
  }

  // ============================================
  // JOURNAL METHODS
  // ============================================

  /**
   * Create a new journal entry
   */
  async createJournal(userId: string, dto: CreateJournalDto) {
    // Map mood string to number (1-10 scale)
    const moodMap: Record<string, number> = {
      VERY_POOR: 2,
      POOR: 4,
      OKAY: 6,
      GOOD: 8,
      EXCELLENT: 10,
    };

    return this.prisma.journal.create({
      data: {
        userId,
        title: dto.title,
        content: dto.content,
        mood: moodMap[dto.mood] || 5,
        tags: dto.tags,
        visibility: (dto.visibility as any) || 'PRIVATE',
        status: 'PENDING_REVIEW',
      },
    });
  }

  /**
   * Get user journals with pagination
   */
  async getUserJournals(userId: string, params: PaginationParams) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [journals, total] = await Promise.all([
      this.prisma.journal.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.journal.count({ where: { userId } }),
    ]);

    return {
      data: journals,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get journal by ID
   */
  async getJournal(id: string, userId: string) {
    const journal = await this.prisma.journal.findFirst({
      where: { id, userId },
    });

    if (!journal) {
      throw new NotFoundException('Journal not found');
    }

    return journal;
  }

  /**
   * Delete journal
   */
  async deleteJournal(id: string, userId: string) {
    const journal = await this.prisma.journal.findFirst({
      where: { id, userId },
    });

    if (!journal) {
      throw new NotFoundException('Journal not found');
    }

    await this.prisma.journal.delete({ where: { id } });
    return { message: 'Journal deleted successfully' };
  }

  // ============================================
  // GOAL METHODS
  // ============================================

  /**
   * Create a new goal
   */
  async createGoal(userId: string, dto: CreateGoalDto) {
    // Map DTO status to schema GoalStatus enum
    const statusMap: Record<string, any> = {
      NOT_STARTED: 'ACTIVE',
      IN_PROGRESS: 'ACTIVE',
      COMPLETED: 'COMPLETED',
      ABANDONED: 'ABANDONED',
    };

    return this.prisma.goal.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        targetDate: new Date(dto.targetDate),
        status: statusMap[dto.status || 'NOT_STARTED'] || 'ACTIVE',
        progress: 0,
      },
    });
  }

  /**
   * Get user goals
   */
  async getUserGoals(userId: string, params: PaginationParams) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [goals, total] = await Promise.all([
      this.prisma.goal.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          tasks: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.goal.count({ where: { userId } }),
    ]);

    return {
      data: goals,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update goal progress
   */
  async updateGoalProgress(goalId: string, userId: string, progress: number) {
    const goal = await this.prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    return this.prisma.goal.update({
      where: { id: goalId },
      data: {
        progress,
        status: progress >= 100 ? 'COMPLETED' : 'ACTIVE',
        completedAt: progress >= 100 ? new Date() : null,
      },
    });
  }
}
