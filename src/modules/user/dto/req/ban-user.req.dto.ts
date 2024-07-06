import { PickType } from '@nestjs/swagger';

import { BaseBanUserReqDto } from './base-ban-user.req.dto';

export class BanUserReqDto extends PickType(BaseBanUserReqDto, [
  'userId',
  'reason',
] as const) {}
