import { Global, Module } from '@nestjs/common';

import { BannedUserRepository } from './services/banned-user.repository';
import { CarRepository } from './services/car.repository';
import { DealershipRepository } from './services/dealership.repository';
import { PostRepository } from './services/post.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';

const repositories = [
  RefreshTokenRepository,
  UserRepository,
  BannedUserRepository,
  PostRepository,
  CarRepository,
  DealershipRepository,
];

@Global()
@Module({
  providers: [...repositories],
  exports: [...repositories],
})
export class RepositoryModule {}
