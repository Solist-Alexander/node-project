import { UserEntity } from '../../../database/entities/user.entity';
import { UserMapper } from '../../user/services/user.mapper';
import { AuthResDto } from '../dto/res/auth.res.dto';
import { ITokenPair } from '../interfaces/token-pair.interface';

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
}
