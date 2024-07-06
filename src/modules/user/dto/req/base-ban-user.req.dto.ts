import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class BaseBanUserReqDto {
  @ApiProperty({ example: '123' })
  @IsString()
  @Length(1, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  userId: string;

  @ApiProperty({ example: 'Нарушение правил' })
  @IsString()
  @Length(1, 300)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  reason: string;
}
