import { ApiProperty, PickType } from '@nestjs/swagger';

import { BaseCarReqDto } from '../req/base-car.req.dto';

export class CarResDto extends PickType(BaseCarReqDto, [
  'brand',
  'model',
  'year',
  'price',
]) {
  @ApiProperty({ example: 1 })
  id: number;
}
