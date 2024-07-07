import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PostEntity } from '../../../database/entities/post.entity';
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
        'Only sellers, admins or super admins can create posts.',
      );
    }
    if (!user.premium) {
      const userPostsCount = await this.postRepository.count({
        where: { id_sender: userData.userId },
      });
      if (userPostsCount > 0) {
        throw new UnauthorizedException(
          'Users without premium status can only create one post.',
        );
      }
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
  async getAllPosts(): Promise<PostEntity[]> {
    return await this.postRepository.find();
  }

  async removePostById(postId: string): Promise<void> {
    const result = await this.postRepository.delete(postId);
    if (result.affected === 0) {
      throw new NotFoundException(`Post with id '${postId}' not found.`);
    }
  }

  async deletePostMe(postId: string, userId: string): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('The post was not found.');
    }

    if (post.id_sender !== userId) {
      throw new UnauthorizedException(`You can't delete this post.`);
    }

    await this.postRepository.delete(postId);
  }
}
