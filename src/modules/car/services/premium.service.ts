import { Injectable } from '@nestjs/common';

import { CarRepository } from '../../repository/services/car.repository';
import { PostRepository } from '../../repository/services/post.repository';
import { UserRepository } from '../../repository/services/user.repository';

@Injectable()
export class PremiumService {
  constructor(
    private readonly carRepository: CarRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getAveragePrice(brand: string, model: string): Promise<number> {
    const posts = await this.postRepository.find({
      where: { brand, model },
    });

    if (posts.length === 0) {
      return 0;
    }

    const totalPrices = posts.reduce((sum, post) => {
      const price = Number(post.price);
      return !isNaN(price) ? sum + price : sum;
    }, 0);

    return totalPrices / posts.length;
  }
}
