import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse, ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";

import { CurrentUser } from '../auth/decorators/current-user.decorator';
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

  // @Post('createCar')
  // @ApiCreatedResponse({ type: CarResDto })
  // async createCar(
  //   @Body() createCarReqDto: CreateCarReqDto,
  // ): Promise<CarResDto> {
  //   return await this.carService.createCar(createCarReqDto);
  // }
}
