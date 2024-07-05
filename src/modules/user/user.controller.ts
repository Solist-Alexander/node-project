import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
  // UseGuards,
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

import { JwtAccessGuard } from '../auth/guards /jwt-access.guard';
// import { AdminGuard } from '../auth/guards /admin.guard';
// import { ManagerGuard } from '../auth/guards /manager.guard';
import { UpdateUserReqDto } from './dto/req/update-user.req.dto';
import { UpdateUserPremiumDto } from './dto/req/update-user-premium.dto';
import { UserResDto } from './dto/res/user.res.dto';
import { UserService } from './services/user.service';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':id')
  public async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResDto> {
    return await this.userService.findOne(id);
  }

  @UseGuards(JwtAccessGuard)
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ type: UserResDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Patch(':id/UpdateMe')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    return await this.userService.update(id, updateUserDto);
  }
  @UseGuards(JwtAccessGuard)
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
    return await this.userService.updatePremium(id, updateUserPremiumDto);
  }

  // @UseGuards(AdminGuard, ManagerGuard)
  @UseGuards(JwtAccessGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete(':id')
  public async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.userService.remove(id);
  }
}
