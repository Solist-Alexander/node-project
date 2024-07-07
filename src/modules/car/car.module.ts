import { Module } from '@nestjs/common';

import { CarRepository } from '../repository/services/car.repository';
import { PostRepository } from '../repository/services/post.repository';
import { CarController } from './car.controller';
import { CarService } from './services/car.service';
import { PostService } from './services/post.service';

@Module({
  controllers: [CarController],
  providers: [CarService, CarRepository, PostRepository, PostService],
})
export class CarModule {}
