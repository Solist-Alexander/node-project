import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { BannedUserGuard } from '../auth/guards /banned-user.guard';
import { ManagerGuard } from '../auth/guards /manager.guard';
import { AuthCacheService } from '../auth/services/auth-cache.service';
import { TokenService } from '../auth/services/token.service';
import { RedisModule } from '../redis/redis.module';
import { CarRepository } from '../repository/services/car.repository';
import { PostRepository } from '../repository/services/post.repository';
import { UserModule } from '../user/user.module';
import { CarController } from './car.controller';
import { CarService } from './services/car.service';
import { PostService } from './services/post.service';
import { PremiumService } from './services/premium.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({}),
    ConfigModule.forRoot(),
    RedisModule,
  ],
  controllers: [CarController],
  providers: [
    CarService,
    CarRepository,
    PostRepository,
    PostService,
    BannedUserGuard,
    ManagerGuard,
    TokenService,
    AuthCacheService,
    PremiumService,
  ],
})
export class CarModule {}
