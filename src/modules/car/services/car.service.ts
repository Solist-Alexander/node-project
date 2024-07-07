import { Injectable } from '@nestjs/common';

import { CarRepository } from '../../repository/services/car.repository';
import { DealershipRepository } from '../../repository/services/dealership.repository';

@Injectable()
export class CarService {
  constructor(
    private readonly carRepository: CarRepository,
    private readonly dealershipRepository: DealershipRepository,
  ) {}

  // public async createCar(createCarReqDto: CreateCarReqDto): Promise<CarResDto> {
  //   const { brand, model, year, price, dealershipId } = createCarReqDto;
  //
  //   let dealership: DealershipEntity | null = null;
  //   if (dealershipId) {
  //     dealership = await this.dealershipRepository.findOne(dealershipId);
  //     if (!dealership) {
  //       throw new NotFoundException('Dealership not found');
  //     }
  //   }
  //
  //   const car = this.carRepository.create({
  //     brand,
  //     model,
  //     year,
  //     price,
  //     dealership,
  //   });
  //   const savedCar = await this.carRepository.save(car);
  //
  //   return {
  //     id: savedCar.id,
  //     brand: savedCar.brand,
  //     model: savedCar.model,
  //     year: savedCar.year,
  //     price: savedCar.price,
  //   };
  // }
}
