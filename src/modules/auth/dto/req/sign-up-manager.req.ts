import { PickType } from '@nestjs/swagger';

import { BaseAuthReqDto } from './base-auth.req.dto';

export class SignUpManagerReqDto extends PickType(BaseAuthReqDto, [
  'name',
  'email',
  'password',
  'phone',
]) {}
