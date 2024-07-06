import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { ManagerGuard } from '../auth/guards /manager.guard';
import { IUserData } from '../auth/interfaces/user-data.interface';
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
  public async getMe(@CurrentUser() userData: IUserData): Promise<UserResDto> {
    return await this.userService.getMe(userData);
  }
  @ApiTags('Admin')
  @ApiTags('Manager')
  @UseGuards(AdminGuard, ManagerGuard)
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
  @Patch(':id/UpdateUser')
  public async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    return await this.adminService.updateUser(id, updateUserDto);
  }
  @ApiTags('Admin')
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
  public async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.adminService.removeUser(id);
  }
}
