import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BannedUserEntity } from '../../../database/entities/banned-user.entity';

@Injectable()
export class BannedUserRepository extends Repository<BannedUserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(BannedUserEntity, dataSource.manager);
  }
  async findBannedUserReason(userId: string): Promise<string | null> {
    const bannedUser = await this.findOne({ where: { user: { id: userId } } });
    return bannedUser ? bannedUser.reason : null;
  }
}
