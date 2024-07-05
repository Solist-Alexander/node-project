import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SkipAuth } from './decorators/skip-auth.decorator';
import { SignInReqDto } from './dto/req/sign-in.req.dto';
import { SignUpReqDto } from './dto/req/sign-up.req.dto';
import { AuthService } from './services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('sign-up')
  public async singUp(@Body() dto: SignUpReqDto): Promise<any> {
    return await this.authService.singUp(dto);
  }

  @SkipAuth()
  @Post('sign-in')
  public async signIn(@Body() signInReqDto: SignInReqDto): Promise<any> {
    return await this.authService.signIn(signInReqDto);
  }
}
