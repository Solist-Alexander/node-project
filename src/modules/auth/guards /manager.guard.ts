import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@sentry/node';

import { AccountRole } from '../enums/account-role';

@Injectable()
export class ManagerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (user.role !== AccountRole.MANAGER && user.role !== AccountRole.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
