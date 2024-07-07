import { Column, Entity, ManyToOne } from 'typeorm';

import { CarBrandEnum } from '../../modules/car/enums/car-brand.enum';
import { CarModelEnum } from '../../modules/car/enums/car-model.enum';
import { DealershipEntity } from './dealership.entity';
import { BaseModel } from './models/base.model';

@Entity()
export class CarEntity extends BaseModel {
  @Column({
    type: 'enum',
    enum: CarBrandEnum,
  })
  brand: CarBrandEnum;

  @Column({
    type: 'enum',
    enum: CarModelEnum,
  })
  model: CarModelEnum;

  @Column()
  year: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => DealershipEntity, (dealership) => dealership.cars)
  dealership: DealershipEntity;
}
