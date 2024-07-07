import { Column, Entity } from 'typeorm';

import { BaseModel } from './models/base.model';

@Entity()
export class MessageEntity extends BaseModel {
  @Column()
  message: string;

  @Column()
  id_car: number;

  @Column()
  id_sender: number;

  @Column()
  id_recipient: number;
}
