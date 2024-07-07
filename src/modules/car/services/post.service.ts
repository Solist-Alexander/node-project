import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PostEntity } from '../../../database/entities/post.entity';
import { AccountRole } from '../../auth/enums/account-role';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { CarRepository } from '../../repository/services/car.repository';
import { PostRepository } from '../../repository/services/post.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { bannedWords } from '../constants/banned-words.constants';
import { CreatePostReqDto } from '../dto/req/create-post.req.dto';
import { PostResDto } from '../dto/res/post.res.dto';
import { CarBrandEnum } from '../enums/car-brand.enum';
import { CarModelEnum } from '../enums/car-model.enum';

@Injectable()
export class PostService {
  constructor(
    private readonly carRepository: CarRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  private containsBannedWords(text: string): boolean {
    const lowerCaseText: string = text.toLowerCase();
    return bannedWords.some((word: string) => lowerCaseText.includes(word));
  }

  public async createPost(
    dto: CreatePostReqDto,
    userData: IUserData,
  ): Promise<PostResDto> {
    const { ...postData } = dto;
    const user = await this.userRepository.findOne({
      where: { id: userData.userId },
    });

    if (!user || user.role !== AccountRole.SELLER) {
      throw new UnauthorizedException('Only sellers can create posts.');
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

    // Profanity check
    if (this.containsBannedWords(dto.message)) {
      throw new BadRequestException('Post contains banned words');
    }

    const newPost = this.postRepository.create({
      ...postData,
      brand: CarBrandEnum[dto.brand], // Преобразуйте dto.brand в соответствующее перечисление
      model: CarModelEnum[dto.model], // Преобразуйте dto.model в соответствующее перечисление
      id_sender: userData.userId,
    });

    const savedPost = await this.postRepository.save(newPost);

    return {
      ...savedPost,
      brand: savedPost.brand as CarBrandEnum, // Убедитесь, что типы соответствуют ожидаемым
      model: savedPost.model as CarModelEnum, // Убедитесь, что типы соответствуют ожидаемым
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
