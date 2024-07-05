import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class BaseUserReqDto {
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  name: string;

  @IsString()
  @Length(0, 15)
  phone: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  @ApiProperty({ example: 'buyer' })
  role?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false })
  premium?: boolean;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsString()
  @Length(0, 300)
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
  email: string;

  @ApiProperty({ example: '123qwe!@#QWE' })
  @IsString()
  @Length(0, 300)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  password: string;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  isActive?: boolean;
}
