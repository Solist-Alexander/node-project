import { PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { BaseCarReqDto } from './base-car.req.dto';

export class CreateCarReqDto extends PickType(BaseCarReqDto, [
  'brand',
  'model',
  'year',
  'price',
]) {
  @IsOptional()
  dealershipId?: string;
}
