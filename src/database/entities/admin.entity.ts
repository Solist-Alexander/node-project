import { Column, Entity, ManyToOne } from 'typeorm';

import { DealershipEntity } from './dealership.entity';
import { BaseModel } from './models/base.model';

@Entity()
export class AdminEntity extends BaseModel {
  @Column()
  name: string;

  @ManyToOne(() => DealershipEntity, (dealership) => dealership.admins)
  dealership: DealershipEntity;
}
