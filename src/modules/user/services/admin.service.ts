import { Injectable, NotFoundException } from '@nestjs/common';

import { BannedUserEntity } from '../../../database/entities/banned-user.entity';
import { PasswordService } from '../../auth/services/password.service';
import { LoggerService } from '../../logger/logger.service';
import { BannedUserRepository } from '../../repository/services/banned-user.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UpdateUserReqDto } from '../dto/req/update-user.req.dto';
import { UpdateUserPremiumDto } from '../dto/req/update-user-premium.dto';
import { UserResDto } from '../dto/res/user.res.dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class AdminService {
  constructor(
    private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly bannedUserRepository: BannedUserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async getListUser(): Promise<UserResDto[]> {
    return await this.userRepository.getList();
  }

  public async findOne(id: string): Promise<UserResDto> {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const userResDto: UserResDto = {
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      premium: user.premium,
      avatar: user.avatar,
    };

    return userResDto;
  }

  public async updateUser(
    id: string,
    updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (updateUserDto.password) {
      const hashedPassword = await this.passwordService.hashPassword(
        updateUserDto.password,
      );
      updateUserDto.password = hashedPassword;
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });

    return UserMapper.toResponseDTO(updatedUser);
  }

  public async removeUser(id: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.refreshTokenRepository.delete({ user_id: id });

    await this.userRepository.remove(user);

    this.logger.log(`User with id ${id} removed`);
  }
  public async updatePremium(
    id: string,
    updateUserPremiumDto: UpdateUserPremiumDto,
  ): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    user.premium = updateUserPremiumDto.premium;

    const updatedUser = await this.userRepository.save(user);

    return UserMapper.toResponseDTO(updatedUser);
  }

  async CheckUserIsBanned(userId: string): Promise<boolean> {
    return await this.userRepository.isUserBanned(userId);
  }

  async checkUserIsBannedWithReason(
    userId: string,
  ): Promise<{ isBanned: boolean; reason?: string }> {
    const isBanned = await this.userRepository.isUserBanned(userId);
    if (isBanned) {
      const reason =
        await this.bannedUserRepository.findBannedUserReason(userId);
      return { isBanned: true, reason };
    } else {
      return { isBanned: false };
    }
  }

  async BanUser(userId: string, reason: string): Promise<string> {
    const isBanned = await this.CheckUserIsBanned(userId);

    if (isBanned) {
      return 'The user has already been banned';
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return 'User not found';
    }

    const bannedUser = new BannedUserEntity();
    bannedUser.user = user;
    bannedUser.reason = reason;
    await this.userRepository.manager.save(bannedUser);

    return 'User successfully banned';
  }

  async unbanUser(userId: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`Пользователь с ID ${userId} не найден`);
    }

    const bannedUser = await this.bannedUserRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!bannedUser) {
      throw new Error(`Пользователь с ID ${userId} не был забанен ранее`);
    }

    await this.bannedUserRepository.delete(bannedUser.id);
    return `Пользователь с ID ${userId} успешно разбанен`;
  }
}
