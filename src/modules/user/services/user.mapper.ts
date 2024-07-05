import { UserEntity } from '../../../database/entities/user.entity';
import { UserResDto } from '../dto/res/user.res.dto';

export class UserMapper {
  public static toResponseDTO(user: UserEntity): UserResDto {
    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      premium: user.premium,
      avatar: user.avatar || null,
    };
  }
}
