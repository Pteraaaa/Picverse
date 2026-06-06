// Strategy Pattern applied here for JWT validation encapsulating token extraction and verification
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'picverse-secret-key-12345',
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
