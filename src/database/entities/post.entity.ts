import { Column, Entity } from 'typeorm';

import { BaseModel } from './models/base.model';

@Entity()
export class PostEntity extends BaseModel {
  @Column()
  message: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  id_sender: string;

  @Column({ nullable: true })
  id_recipient: string;

  @Column()
  avatar: string;
}
