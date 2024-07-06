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

import { AdminGuard } from '../auth/guards /admin.guard';
import { ManagerGuard } from '../auth/guards /manager.guard';
import { UpdateUserReqDto } from './dto/req/update-user.req.dto';
import { UpdateUserPremiumDto } from './dto/req/update-user-premium.dto';
import { UserResDto } from './dto/res/user.res.dto';
import { AdminService } from './services/admin.service';
import { UserService } from './services/user.service';

@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {}

  @ApiTags('Admin')
  @ApiTags('Manager')
  @UseGuards(AdminGuard, ManagerGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':id')
  public async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResDto> {
    return await this.adminService.findOne(id);
  }
  @ApiTags('Users')
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':id/myInfo')
  public async myInfo(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResDto> {
    return await this.userService.myInfo();
  }

  @UseGuards(AdminGuard)
  @ApiTags('Admin')
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ type: UserResDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Patch(':id/UpdateUser')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    return await this.adminService.updateUser(id, updateUserDto);
  }
  @ApiTags('Admin')
  @ApiOperation({ summary: 'Update user premium status' })
  @ApiOkResponse({ type: UserResDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Patch(':id/premium')
  public async updatePremium(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserPremiumDto: UpdateUserPremiumDto,
  ): Promise<UserResDto> {
    return await this.adminService.updatePremium(id, updateUserPremiumDto);
  }

  @UseGuards(AdminGuard)
  @ApiTags('Admin')
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete(':id')
  public async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.adminService.removeUser(id);
  }
}
