import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserEntity } from '../../../database/entities/user.entity';
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

  public async findAll(): Promise<any> {
    return `This action returns all user`;
  }

  public async findUserOrThrow(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return user;
  }

  public async findOne(id: string): Promise<UserResDto> {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Преобразование данных пользователя в UserResDto
    const userResDto: UserResDto = {
      name: user.name,
      phone: user.phone,
      email: user.email,
      status: user.status,
      premium: user.premium,
      avatar: user.avatar,
    };

    return userResDto;
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({
      id: id,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (updateUserDto.password) {
      const hashedPassword = await this.passwordService.hashPassword(
        updateUserDto.password,
      );
      user.password = hashedPassword;
    }

    // await this.userRepository.save(updateUserDto);

    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
    return UserMapper.toResponseDTO(updatedUser);
  }

  public async remove(id: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.refreshTokenRepository.delete({ user_id: id });

    await this.userRepository.remove(user);

    this.logger.log(`User with id ${id} removed`);
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('Email is already taken');
    }
  }
}
