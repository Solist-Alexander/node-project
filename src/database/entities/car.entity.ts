import { Column, Entity, ManyToOne } from 'typeorm';

import { DealershipEntity } from './dealership.entity';
import { BaseModel } from './models/base.model';

@Entity()
export class CarEntity extends BaseModel {
  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => DealershipEntity, (dealership) => dealership.cars)
  dealership: DealershipEntity;
}
