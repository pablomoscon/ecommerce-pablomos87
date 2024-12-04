import { Injectable } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { OrderDetail } from './entities/order-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(OrderDetail) private orderDetailsRepository: Repository<OrderDetail>,
  ) { }

  async createOrderDetail(createOrderDetailDto: CreateOrderDetailDto) {
    if (!createOrderDetailDto.order) {
      throw new Error('Invalid data: order is required');
    }
    const newOrderDetail = this.orderDetailsRepository.create(createOrderDetailDto);
    return await this.orderDetailsRepository.save(newOrderDetail);
  }
  async findOrderDetailsById(
    orderId: string,
    relations: string[] = [],
  ): Promise<OrderDetail[]> {
    return await this.orderDetailsRepository.find({
      where: { order: { id: orderId } },
      relations: relations,
    });
  };
};
