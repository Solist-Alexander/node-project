import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from '../auth/auth.module';
import { PasswordService } from '../auth/services/password.service';
import { TokenService } from '../auth/services/token.service';
import { AdminService } from './services/admin.service';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot(),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, PasswordService, TokenService, AdminService],
  exports: [UserService, AdminService],
})
export class UserModule {}
