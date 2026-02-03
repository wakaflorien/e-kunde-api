import { Test, TestingModule } from '@nestjs/testing';
import { HealthcareService } from './healthcare.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { SessionType } from '@prisma/client';

describe('HealthcareService', () => {
  let service: HealthcareService;
  let prisma: PrismaService;

  const mockPrismaService = {
    practitionerProfile: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    clinicProfile: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    booking: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    availability: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthcareService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<HealthcareService>(HealthcareService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBooking', () => {
    const createBookingDto = {
      practitionerId: 'practitioner-1',
      sessionType: SessionType.VIDEO,
      scheduledAt: new Date().toISOString(),
      duration: 60,
      notes: 'Test booking',
    };

    it('should create a booking successfully', async () => {
      mockPrismaService.practitionerProfile.findUnique.mockResolvedValue({ id: 'practitioner-1' });
      mockPrismaService.booking.create.mockResolvedValue({ id: 'booking-1', ...createBookingDto });

      const result = await service.createBooking('user-1', createBookingDto as any);

      expect(result).toBeDefined();
      expect(mockPrismaService.booking.create).toHaveBeenCalled();
    });
  });

  describe('practitionerProfile', () => {
    it('should throw NotFoundException if profile not found', async () => {
      mockPrismaService.practitionerProfile.findUnique.mockResolvedValue(null);

      await expect(service.getPractitionerProfile('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return profile if found', async () => {
      const mockProfile = { id: 'profile-1', userId: 'user-1' };
      mockPrismaService.practitionerProfile.findUnique.mockResolvedValue(mockProfile);

      const result = await service.getPractitionerProfile('user-1');
      expect(result).toEqual(mockProfile);
    });
  });

  describe('availability', () => {
    const createAvailabilityDto = {
      date: '2025-12-25',
      startTime: '09:00',
      endTime: '17:00',
      slots: [{ time: '09:00', available: true }],
    };

    it('should create availability successfully', async () => {
      mockPrismaService.practitionerProfile.findUnique.mockResolvedValue({ id: 'pract-1' });
      mockPrismaService.availability.create.mockResolvedValue({ id: 'avail-1', ...createAvailabilityDto });

      const result = await service.createAvailability('user-1', createAvailabilityDto as any);

      expect(result).toBeDefined();
      expect(mockPrismaService.availability.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if practitioner profile missing when creating availability', async () => {
        mockPrismaService.practitionerProfile.findUnique.mockResolvedValue(null);
  
        await expect(service.createAvailability('user-1', createAvailabilityDto as any)).rejects.toThrow(
          NotFoundException,
        );
      });
  });
});
