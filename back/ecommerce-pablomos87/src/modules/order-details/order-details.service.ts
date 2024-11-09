import { Injectable } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
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
  async findAll() {
    return await `This action returns all orderDetails`;
  };

  async findOne(id: number) {
    return await `This action returns a #${id} orderDetail`;
  };

  async update(id: number, updateOrderDetailDto: UpdateOrderDetailDto) {
    return await `This action updates a #${id} orderDetail`;
  };

  async remove(id: number) {
    return await `This action removes a #${id} orderDetail`;
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
