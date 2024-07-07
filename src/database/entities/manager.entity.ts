import { Column, Entity, ManyToOne } from 'typeorm';

import { DealershipEntity } from './dealership.entity';
import { BaseModel } from './models/base.model';

@Entity()
export class ManagerEntity extends BaseModel {
  @Column()
  name: string;

  @ManyToOne(() => DealershipEntity, (dealership) => dealership.managers)
  dealership: DealershipEntity;
}
