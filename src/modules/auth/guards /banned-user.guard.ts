import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { AdminService } from '../../user/services/admin.service';
import { IUserData } from '../interfaces/user-data.interface';

@Injectable()
export class BannedUserGuard implements CanActivate {
  constructor(private readonly adminService: AdminService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const userData: IUserData = request.user;

      if (!userData || !userData.userId) {
        throw new ForbiddenException('User ID not found in request.');
      }

      const isBanned = await this.adminService.CheckUserIsBanned(
        userData.userId,
      );

      if (isBanned) {
        throw new ForbiddenException(
          `User with ID ${userData.userId} is banned.`,
        );
      }

      return true; // Разрешаем доступ, если пользователь не забанен
    } catch (error) {
      console.error(`Error in BannedUserGuard: ${error.message}`);
      return false; // Возвращаем false в случае ошибки или если пользователь забанен
    }
  }
}
