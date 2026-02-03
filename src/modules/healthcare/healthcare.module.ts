import { Module } from '@nestjs/common';
import { HealthcareController } from './healthcare.controller';
import { HealthcareService } from './healthcare.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HealthcareController],
  providers: [HealthcareService],
  exports: [HealthcareService],
})
export class HealthcareModule {}
