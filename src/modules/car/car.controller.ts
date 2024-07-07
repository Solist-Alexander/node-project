import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { PostEntity } from '../../database/entities/post.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { BannedUserGuard } from '../auth/guards /banned-user.guard';
import { ManagerGuard } from '../auth/guards /manager.guard';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CreatePostReqDto } from './dto/req/create-post.req.dto';
import { PostResDto } from './dto/res/post.res.dto';
import { CarService } from './services/car.service';
import { PostService } from './services/post.service';

@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiBearerAuth()
@Controller('car')
@UseGuards(BannedUserGuard)
export class CarController {
  constructor(
    private readonly carService: CarService,
    private readonly postService: PostService,
  ) {}

  @ApiTags('Seller')
  @Post('createPost')
  public async createPost(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreatePostReqDto,
  ): Promise<PostResDto> {
    return await this.postService.createPost(dto, userData);
  }

  @ApiTags('Admin')
  @ApiTags('Users')
  @ApiTags('Manager')
  @Get('getAllPosts')
  async getAllPosts(): Promise<PostEntity[]> {
    return await this.postService.getAllPosts();
  }
  @ApiTags('Admin')
  @ApiTags('Manager')
  @Delete(':id/removePost')
  @UseGuards(ManagerGuard)
  async removePost(@Param('id') id: string): Promise<void> {
    await this.postService.removePostById(id);
  }

  @ApiTags('Seller')
  @Delete(':id/deletePostMe')
  async deletePostMe(
    @Param('id') postId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    await this.postService.deletePostMe(postId, userData.userId);
  }
  // @Post('createCar')
  // @ApiCreatedResponse({ type: CarResDto })
  // async createCar(
  //   @Body() createCarReqDto: CreateCarReqDto,
  // ): Promise<CarResDto> {
  //   return await this.carService.createCar(createCarReqDto);
  // }
}
