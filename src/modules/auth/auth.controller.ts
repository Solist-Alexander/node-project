import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from './decorators/current-user.decorator';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { SignInReqDto } from './dto/req/sign-in.req.dto';
import { SignUpReqDto } from './dto/req/sign-up.req.dto';
import { SignUpManagerReqDto } from './dto/req/sign-up-manager.req';
import { TokenPairResDto } from './dto/res/token-pair.res.dto';
import { AdminGuard } from './guards /admin.guard';
import { JwtRefreshGuard } from './guards /jwt-refresh.guard';
import { IUserData } from './interfaces/user-data.interface';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('Auth')
  @SkipAuth()
  @Post('sign-up')
  public async singUp(@Body() dto: SignUpReqDto): Promise<any> {
    return await this.authService.singUp(dto);
  }
  @ApiTags('Auth')
  @SkipAuth()
  @Post('sign-in')
  public async signIn(@Body() signInReqDto: SignInReqDto): Promise<any> {
    return await this.authService.signIn(signInReqDto);
  }
  @ApiTags('Auth')
  @SkipAuth()
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Refresh token pair' })
  @Post('refresh')
  public async refresh(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenPairResDto> {
    return await this.authService.refresh(userData);
  }

  @ApiTags('Auth')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign out' })
  @Post('sign-out')
  public async signOut(@CurrentUser() userData: IUserData): Promise<void> {
    return await this.authService.signOut(userData);
  }
  @ApiTags('Admin')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create manager account' })
  @Post('create-manager')
  public async createManager(@Body() dto: SignUpManagerReqDto): Promise<any> {
    return await this.authService.createManager(dto);
  }
}
