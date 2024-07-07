import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AdminGuard } from '../auth/guards /admin.guard';
import { BannedUserGuard } from '../auth/guards /banned-user.guard';
import { ManagerGuard } from '../auth/guards /manager.guard';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { BanUserReqDto } from './dto/req/ban-user.req.dto';
import { UpdateUserReqDto } from './dto/req/update-user.req.dto';
import { UpdateUserPremiumDto } from './dto/req/update-user-premium.dto';
import { UserResDto } from './dto/res/user.res.dto';
import { AdminService } from './services/admin.service';
import { UserService } from './services/user.service';

@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {}
  @ApiTags('Users')
  @Get('getMe')
  @UseGuards(BannedUserGuard)
  public async getMe(@CurrentUser() userData: IUserData): Promise<UserResDto> {
    return await this.userService.getMe(userData);
  }
  @ApiTags('Users')
  @ApiOperation({ summary: 'Update Me' })
  @ApiOkResponse({ type: UserResDto })
  @Patch('updateMe')
  public async UpdateMe(
    @Body() updateUserDto: UpdateUserReqDto,
    @CurrentUser() userData: IUserData,
  ): Promise<UserResDto> {
    return await this.userService.UpdateMe(userData, updateUserDto);
  }

  @ApiTags('Users')
  @Delete('removeMe')
  public async removeMe(@CurrentUser() userData: IUserData): Promise<void> {
    return await this.userService.removeMe(userData);
  }

  @ApiTags('Admin')
  @ApiTags('Manager')
  @UseGuards(ManagerGuard)
  @Get('getListUser')
  public async getListUser(): Promise<UserResDto[]> {
    return await this.adminService.getListUser();
  }
  @ApiTags('Admin')
  @ApiTags('Manager')
  @UseGuards(ManagerGuard)
  @Get(':id')
  public async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResDto> {
    return await this.adminService.findOne(id);
  }
  @UseGuards(AdminGuard)
  @ApiTags('Admin')
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ type: UserResDto })
  @Patch(':id/updateUser')
  public async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    return await this.adminService.updateUser(id, updateUserDto);
  }
  @ApiTags('Admin')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update user premium status' })
  @ApiOkResponse({ type: UserResDto })
  @Patch(':id/premium')
  public async updatePremium(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserPremiumDto: UpdateUserPremiumDto,
  ): Promise<UserResDto> {
    return await this.adminService.updatePremium(id, updateUserPremiumDto);
  }

  @UseGuards(AdminGuard)
  @ApiTags('Admin')
  @Delete(':id')
  public async removeUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return await this.adminService.removeUser(id);
  }

  @ApiTags('Admin')
  @ApiTags('Manager')
  @UseGuards(ManagerGuard)
  @Get(':id/CheckUserIsBanned')
  @ApiOperation({ summary: 'Check if user is banned' })
  async CheckUserIsBanned(
    @Param('id') userId: string,
  ): Promise<{ isBanned: boolean; reason?: string }> {
    const result = await this.adminService.checkUserIsBannedWithReason(userId);
    return { isBanned: result.isBanned, reason: result.reason };
  }

  @ApiTags('Admin')
  @ApiTags('Manager')
  @UseGuards(ManagerGuard)
  @Post(':id/ban')
  @ApiOperation({ summary: 'Ban a user' })
  async BanUser(
    @Body() banUserReqDto: BanUserReqDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    const message = await this.adminService.BanUser(id, banUserReqDto.reason);
    return { message };
  }

  @ApiTags('Admin')
  @ApiTags('Manager')
  @UseGuards(ManagerGuard)
  @Post(':id/unbanUser')
  @ApiOperation({ summary: 'Разбанить пользователя' })
  @UseGuards(ManagerGuard)
  async unbanUser(
    @Param('userId') userId: string,
  ): Promise<{ message: string }> {
    const message = await this.adminService.unbanUser(userId);
    return { message };
  }
}
