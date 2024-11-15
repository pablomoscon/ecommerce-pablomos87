import { Injectable } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { OrderDetail } from './entities/order-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class OrderDetailsService {
  constructor (
  @InjectRepository (OrderDetail) private orderDetailsRepository: Repository<OrderDetail>,
) {}

  async create(createOrderDetailDto: CreateOrderDetailDto) {
    const newOrderDetail = this.orderDetailsRepository.create(createOrderDetailDto);
    return await this.orderDetailsRepository.save(newOrderDetail);
  };

  async getOrderDetailsById(
    orderId: string,
    relations: string[] = [],
): Promise<OrderDetail[]> {
    return await this.orderDetailsRepository.find({
        where: { order: { id: orderId } },
        relations: relations,
    });
};
};
