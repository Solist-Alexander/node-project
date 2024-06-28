import { Global, Module } from '@nestjs/common';

const repositories = [];

@Global()
@Module({
  providers: [...repositories],
  exports: [...repositories],
})
export class RepositoryModule {}
