import { Injectable, UnauthorizedException } from '@nestjs/common';

import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UserService } from '../../user/services/user.service';
import { SignInReqDto } from '../dto/req/sign-in.req.dto';
import { SignUpReqDto } from '../dto/req/sign-up.req.dto';
import { SignUpManagerReqDto } from '../dto/req/sign-up-manager.req';
import { AuthResDto } from '../dto/res/auth.res.dto';
import { TokenPairResDto } from '../dto/res/token-pair.res.dto';
import { AccountRole } from '../enums/account-role';
import { IUserData } from '../interfaces/user-data.interface';
import { AuthMapper } from './auth.mapper';
import { AuthCacheService } from './auth-cache.service';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly passwordService: PasswordService,
  ) {}

  private generateDeviceId(): string {
    const prefix = 'device_';
    const randomSuffix = Math.random().toString(36).substr(2, 10);
    return `${prefix}${randomSuffix}`;
  }

  public async singUp(dto: SignUpReqDto): Promise<AuthResDto> {
    await this.userService.isEmailUniqueOrThrow(dto.email);

    const password = await this.passwordService.hashPassword(dto.password);
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password }),
    );

    const deviceId = this.generateDeviceId();
    const pair = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: user.id,
          refreshToken: pair.refreshToken,
          deviceId,
        }),
      ),
      this.authCacheService.saveToken(pair.accessToken, user.id, deviceId),
    ]);

    return AuthMapper.toResponseDTO(user, pair);
  }

  public async signIn(dto: SignInReqDto): Promise<AuthResDto> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { password: true, id: true },
    });
    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      dto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong email or password');
    }

    let deviceId = dto.deviceId;
    if (!deviceId) {
      deviceId = this.generateDeviceId(); // Генерируем новый deviceId, если не указан
    }

    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId,
        user_id: user.id,
      }),
      this.authCacheService.deleteToken(user.id, deviceId),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: user.id,
          refreshToken: tokens.refreshToken,
          deviceId,
        }),
      ),
      this.authCacheService.saveToken(tokens.accessToken, user.id, deviceId),
    ]);

    const userEntity = await this.userRepository.findOneBy({ id: user.id });
    return AuthMapper.toResponseDTO(userEntity, tokens);
  }

  public async refresh(userData: IUserData): Promise<TokenPairResDto> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: userData.deviceId,
        user_id: userData.userId,
      }),
      this.authCacheService.deleteToken(userData.userId, userData.deviceId),
    ]);
    const pair = await this.tokenService.generateAuthTokens({
      userId: userData.userId,
      deviceId: userData.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: userData.userId,
          refreshToken: pair.refreshToken,
          deviceId: userData.deviceId,
        }),
      ),
      this.authCacheService.saveToken(
        pair.accessToken,
        userData.userId,
        userData.deviceId,
      ),
    ]);
    return AuthMapper.toResponseTokensDTO(pair);
  }

  public async signOut(userData: IUserData): Promise<void> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: userData.deviceId,
        user_id: userData.userId,
      }),
      this.authCacheService.deleteToken(userData.userId, userData.deviceId),
    ]);
  }

  public async createManager(dto: SignUpManagerReqDto): Promise<AuthResDto> {
    await this.userService.isEmailUniqueOrThrow(dto.email);

    const password = await this.passwordService.hashPassword(dto.password);
    const deviceId = this.generateDeviceId();

    const userToCreate = {
      ...dto,
      password,
      role: AccountRole.MANAGER,
      deviceId,
    };

    const user = await this.userRepository.save(userToCreate);

    const pair = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.save({
        user_id: user.id,
        refreshToken: pair.refreshToken,
        deviceId,
      }),
      this.authCacheService.saveToken(pair.accessToken, user.id, deviceId),
    ]);

    return AuthMapper.toResponseDTO(user, pair);
  }
}
