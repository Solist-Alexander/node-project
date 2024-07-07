import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class BaseCarReqDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1, {
    message: 'Brand is too short. Minimal length is $constraint1 characters.',
  })
  @MaxLength(100, {
    message: 'Brand is too long. Maximal length is $constraint1 characters.',
  })
  brand: string;

  @ApiProperty({ example: 'Camry' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1, {
    message: 'Model is too short. Minimal length is $constraint1 characters.',
  })
  @MaxLength(100, {
    message: 'Model is too long. Maximal length is $constraint1 characters.',
  })
  model: string;

  @ApiProperty({ example: 2020 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1886, { message: 'Year must be greater than or equal to 1886.' })
  @Max(new Date().getFullYear(), {
    message: `Year must be less than or equal to the current year (${new Date().getFullYear()}).`,
  })
  year: number;

  @ApiProperty({ example: 25000.0 })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Price must be a valid decimal number with up to 2 decimal places.',
    },
  )
  @IsNotEmpty()
  @Min(0, { message: 'Price must be a positive number.' })
  price: number;

  @ApiProperty({ example: '123' })
  @IsString()
  @Length(1, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  dealershipId: string;
}
