import { UserEntity } from '../../../database/entities/user.entity';
import { UserMapper } from '../../user/services/user.mapper';
import { AuthResDto } from '../dto/res/auth.res.dto';
import { ITokenPair } from '../interfaces/token-pair.interface';
import { IUserData } from '../interfaces/user-data.interface';

export class AuthMapper {
  public static async toResponseDTO(
    user: UserEntity,
    tokenPair: ITokenPair,
  ): Promise<AuthResDto> {
    return {
      tokens: {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
      },
      user: UserMapper.toResponseDTO(user),
    };
  }

  public static async toUserDataDTO(
    user: UserEntity,
    deviceId: string,
  ): Promise<IUserData> {
    return {
      userId: user.id,
      email: user.email,
      deviceId,
    };
  }
}