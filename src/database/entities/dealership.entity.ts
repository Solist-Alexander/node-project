import { Column, Entity, OneToMany } from 'typeorm';

import { AdminEntity } from './admin.entity';
import { CarEntity } from './car.entity';
import { ManagerEntity } from './manager.entity';
import { BaseModel } from './models/base.model';

@Entity()
export class DealershipEntity extends BaseModel {
  @Column()
  name: string;

  @Column()
  address: string;

  @OneToMany(() => AdminEntity, (admin) => admin.dealership)
  admins: AdminEntity[];

  @OneToMany(() => ManagerEntity, (manager) => manager.dealership)
  managers: ManagerEntity[];

  @OneToMany(() => CarEntity, (car) => car.dealership)
  cars: ManagerEntity[];
}
