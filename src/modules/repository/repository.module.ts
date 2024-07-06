import { Global, Module } from '@nestjs/common';

import { BannedUserRepository } from './services/banned-user.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';

const repositories = [
  RefreshTokenRepository,
  UserRepository,
  BannedUserRepository,
];

@Global()
@Module({
  providers: [...repositories],
  exports: [...repositories],
})
export class RepositoryModule {}
