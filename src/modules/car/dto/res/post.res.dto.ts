import { PickType } from '@nestjs/swagger';

import { BasePostReqDto } from '../req/base-post.req.dto';

export class PostResDto extends PickType(BasePostReqDto, [
  'message',
  'id_sender',
  'brand',
  'model',
  'price',
  'avatar',
  'year',
]) {}
