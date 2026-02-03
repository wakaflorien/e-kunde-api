import { Module } from '@nestjs/common';
import { HealthcareController } from './healthcare.controller';
import { HealthcareService } from './healthcare.service';
import { ReferralController } from './referral.controller';
import { ReferralService } from './referral.service';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HealthcareController, ReferralController, MatchingController],
  providers: [HealthcareService, ReferralService, MatchingService],
  exports: [HealthcareService, ReferralService, MatchingService],
})
export class HealthcareModule {}
