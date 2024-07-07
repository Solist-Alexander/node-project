import { Injectable, UnauthorizedException } from '@nestjs/common';

import { IUserData } from '../../auth/interfaces/user-data.interface';
import { CarRepository } from '../../repository/services/car.repository';
import { PostRepository } from '../../repository/services/post.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { CreatePostReqDto } from '../dto/req/create-post.req.dto';
import { PostResDto } from '../dto/res/post.res.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly carRepository: CarRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}
  public async createPost(
    dto: CreatePostReqDto,
    userData: IUserData,
  ): Promise<PostResDto> {
    const { ...postData } = dto;
    const user = await this.userRepository.findOne({
      where: { id: userData.userId },
    });
    if (
      !user ||
      !(
        user.role === 'seller' ||
        user.role === 'admin' ||
        user.role === 'manager'
      )
    ) {
      throw new UnauthorizedException(
        'Только продавцы, администраторы или суперадмины могут создавать посты.',
      );
    }
    const newPost = await this.postRepository.create({
      ...postData,
      id_sender: userData.userId,
    });

    const savedPost = await this.postRepository.save(newPost);

    return {
      ...savedPost,
    };
  }
}
