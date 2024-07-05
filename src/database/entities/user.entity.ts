import { Column, Entity, OneToMany } from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity({ name: TableNameEnum.USERS })
export class UserEntity extends BaseModel {
  @Column('text')
  name: string;

  @Column()
  phone: string;

  @Column({ default: 'buyer' })
  role: string;

  @Column({ default: false })
  premium: boolean;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];
}
