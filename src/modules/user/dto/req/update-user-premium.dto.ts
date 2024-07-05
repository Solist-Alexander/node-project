import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateUserPremiumDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  premium: boolean;
}
