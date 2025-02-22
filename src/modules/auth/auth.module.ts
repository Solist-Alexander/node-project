import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { RedisModule } from '../redis/redis.module';
import { BannedUserRepository } from '../repository/services/banned-user.repository';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AdminGuard } from './guards /admin.guard';
import { BannedUserGuard } from './guards /banned-user.guard';
import { JwtAccessGuard } from './guards /jwt-access.guard';
import { JwtRefreshGuard } from './guards /jwt-refresh.guard';
import { ManagerGuard } from './guards /manager.guard';
import { AuthService } from './services/auth.service';
import { AuthCacheService } from './services/auth-cache.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';

@Module({
  imports: [JwtModule, forwardRef(() => UserModule), RedisModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    AuthCacheService,
    PasswordService,
    AdminGuard,
    ManagerGuard,
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    JwtRefreshGuard,
    BannedUserGuard,
    BannedUserRepository,
  ],
  exports: [
    TokenService,
    AuthCacheService,
    AdminGuard,
    ManagerGuard,
    BannedUserGuard,
  ],
})
export class AuthModule {}
