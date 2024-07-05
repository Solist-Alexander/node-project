import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { PasswordService } from '../auth/services/password.service';
import { TokenService } from '../auth/services/token.service';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [JwtModule.register({}), ConfigModule.forRoot()],
  controllers: [UserController],
  providers: [UserService, PasswordService, TokenService],
  exports: [UserService],
})
export class UserModule {}
