import { PickType } from '@nestjs/swagger';

import { BasePostReqDto } from './base-post.req.dto';

export class CreatePostReqDto extends PickType(BasePostReqDto, [
  'message',
  'brand',
  'model',
  'price',
  'avatar',
  'price',
  'year',
]) {}
