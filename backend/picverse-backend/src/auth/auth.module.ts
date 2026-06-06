// Dependency Injection / Singleton Pattern: Providers (AuthService, JwtStrategy, JwtAuthGuard) are configured and exported
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'picverse-secret-key-12345',
      signOptions: {
        expiresIn: '7d'
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [PassportModule, JwtModule, JwtAuthGuard]
})
export class AuthModule {}
