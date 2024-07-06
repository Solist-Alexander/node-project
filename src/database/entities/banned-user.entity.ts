import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';

@Entity()
export class BannedUserEntity extends BaseModel {
  @Column()
  reason: string;

  @ManyToOne(() => UserEntity, (user) => user.bans)
  user: UserEntity;
}
