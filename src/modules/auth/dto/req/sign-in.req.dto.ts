import { PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { BaseAuthReqDto } from './base-auth.req.dto';

export class SignInReqDto extends PickType(BaseAuthReqDto, [
  'email',
  'password',
]) {
  @IsOptional()
  @IsString()
  deviceId?: string;
}
