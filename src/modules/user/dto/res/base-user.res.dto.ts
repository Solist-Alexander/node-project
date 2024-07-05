import { ApiProperty } from '@nestjs/swagger';

export class BaseUserResDto {
  @ApiProperty({
    example: '121324354678976543fdg',
    description: 'The id of the User',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the User',
  })
  name: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'The phone number of the User',
  })
  phone: string;

  @ApiProperty({
    example: 'buyer',
    description: 'The status of the User',
  })
  role: string;

  @ApiProperty({
    example: false,
    description: 'The premium status of the User',
  })
  premium: boolean;

  @ApiProperty({
    example: 'test@gmail.com',
    description: 'The email of the User',
  })
  email: string;

  @ApiProperty({
    example: 'https://www.example.com/avatar.jpg',
    description: 'The avatar of the User',
  })
  avatar?: string;

  @ApiProperty({
    example: true,
    description: 'The active status of the User',
  })
  isActive: boolean;
}
