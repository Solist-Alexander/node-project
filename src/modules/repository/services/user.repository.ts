import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserEntity } from '../../../database/entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
  }
  async getList(): Promise<UserEntity[]> {
    return await this.dataSource.manager.find(UserEntity);
  }
  async isUserBanned(userId: string): Promise<boolean> {
    const bannedUser = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.bans', 'bans')
      .where('user.id = :userId', { userId })
      .getOne();

    return !!bannedUser?.bans.length;
  }
}
