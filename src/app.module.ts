import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MentalHealthModule } from './modules/mental-health/mental-health.module';
import { HealthcareModule } from './modules/healthcare/healthcare.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards';
import { CommunityModule } from './modules/community/community.module';
import { PostModule } from './modules/post/post.module';
import { InsuranceModule } from './modules/insurance/insurance.module';
import { ClaimModule } from './modules/claim/claim.module';
import configuration from 'configuration/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    MentalHealthModule,
    HealthcareModule,
    CommunityModule,
    PostModule,
    InsuranceModule,
    ClaimModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
