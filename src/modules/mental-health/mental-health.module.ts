import { Module } from '@nestjs/common';
import { MentalHealthService } from './mental-health.service';
import { MentalHealthController } from './mental-health.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MentalHealthController],
  providers: [MentalHealthService],
  exports: [MentalHealthService],
})
export class MentalHealthModule {}
