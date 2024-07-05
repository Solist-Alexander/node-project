import { PartialType, PickType } from '@nestjs/swagger';

import { AccountRole } from '../../../auth/enums/account-role';
import { BaseUserReqDto } from './base-user.req.dto';

export class UpdateUserReqDto extends PartialType(
  PickType(BaseUserReqDto, ['name', 'phone', 'avatar', 'password'] as const),
) {
  role?: AccountRole;
}
