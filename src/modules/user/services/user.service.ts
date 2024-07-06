import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { IUserData } from '../../auth/interfaces/user-data.interface';
import { PasswordService } from '../../auth/services/password.service';
import { LoggerService } from '../../logger/logger.service';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UpdateUserReqDto } from '../dto/req/update-user.req.dto';
import { UserResDto } from '../dto/res/user.res.dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly passwordService: PasswordService,
  ) {}
  public async getMe(userData: IUserData): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    return UserMapper.toResponseDTO(user);
  }
  public async UpdateMe(
    userData: IUserData,
    updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });

    if (!user) {
      throw new NotFoundException(`User with id ${user.id} not found`);
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
  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('Email is already taken');
    }
  }
}
