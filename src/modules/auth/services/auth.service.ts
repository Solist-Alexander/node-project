import { Injectable, UnauthorizedException } from '@nestjs/common';

import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UserService } from '../../user/services/user.service';
import { SignInReqDto } from '../dto/req/sign-in.req.dto';
import { SignUpReqDto } from '../dto/req/sign-up.req.dto';
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

  public async singUp(dto: SignUpReqDto): Promise<any> {
    await this.userService.isEmailUniqueOrThrow(dto.email);

    const password = await this.passwordService.hashPassword(dto.password);
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password }),
    );
    const pair = await this.tokenService.generateAuthTokens({
      userId: user.id,
      role: user.role,
      deviceId: dto.deviceId,
    });
    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: user.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.authCacheService.saveToken(pair.accessToken, user.id, dto.deviceId),
    ]);
    return await AuthMapper.toResponseDTO(user, pair);
  }

  public async signIn(dto: SignInReqDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
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

    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId, // Ensure deviceId is passed here
      role: user.role,
    });

    await this.refreshTokenRepository.save({
      user_id: user.id,
      refreshToken: tokens.refreshToken,
      deviceId: dto.deviceId, // Ensure deviceId is passed here
    });

    return { user, tokens };
  }
}
