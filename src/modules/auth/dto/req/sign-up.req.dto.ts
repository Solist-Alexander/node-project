import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

import { AccountRole } from '../../enums/account-role';
import { BaseAuthReqDto } from './base-auth.req.dto';

export class SignUpReqDto extends PickType(BaseAuthReqDto, [
  'name',
  'email',
  'password',
  'phone',
]) {
  @IsOptional()
  @IsIn([AccountRole.SELLER, AccountRole.BUYER])
  @ApiProperty({ example: AccountRole.BUYER })
  role?: AccountRole;
}
