import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthPayload } from '../../../common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: AuthPayload) {
    if (!payload.user) {
      // Fallback for old tokens or if user data is missing
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          profile: true,
          consentSettings: true,
        },
      });
      return user;
    }
    return payload.user;
  }
}
