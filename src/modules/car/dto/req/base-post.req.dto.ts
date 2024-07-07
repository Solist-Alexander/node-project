import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class BasePostReqDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, {
    message: 'Message is too short. Minimal length is $constraint1 characters.',
  })
  @MaxLength(500, {
    message: 'Message is too long. Maximal length is $constraint1 characters.',
  })
  message: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @Length(1, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  id_sender: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @Length(1, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  id_recipient?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, {
    message: 'Brand is too short. Minimal length is $constraint1 characters.',
  })
  @MaxLength(100, {
    message: 'Brand is too long. Maximal length is $constraint1 characters.',
  })
  brand: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, {
    message: 'Model is too short. Minimal length is $constraint1 characters.',
  })
  @MaxLength(100, {
    message: 'Model is too long. Maximal length is $constraint1 characters.',
  })
  model: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1886, { message: 'Year must be greater than or equal to 1886.' }) // The first automobile was made in 1886
  @Max(new Date().getFullYear(), {
    message: `Year must be less than or equal to the current year (${new Date().getFullYear()}).`,
  })
  year: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'Price must be a positive number.' })
  price: number;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  avatar?: string;
}
