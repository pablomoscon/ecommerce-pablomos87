import { ProductsService } from './../products/products.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, PartialProducts } from './dto/create-order.dto';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { CreateOrderDetailDto } from '../order-details/dto/create-order-detail.dto';
import { OrderDetailsService } from '../order-details/order-details.service';
import { OrderDetail } from '../order-details/entities/order-detail.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly orderDetailsService: OrderDetailsService,
  ) { }

  async addOrder(createOrderDto: CreateOrderDto) {
    const { userId, products } = createOrderDto;

    const user = await this.usersService.getUsersById(userId);

    const order = {
      user: user,
      date: new Date(),
    };

    const orderEntity = await this.ordersRepository.save(
      this.ordersRepository.create(order)
    );

    const total = await this.calculateTotal(products);

    const orderDetail = new CreateOrderDetailDto();
    orderDetail.price = total;
    orderDetail.products = products;
    orderDetail.order = orderEntity;
    const orderDetailEntity = await this.orderDetailsService.create(orderDetail);
    return orderDetailEntity;
  }

  private async calculateTotal(products: Array<PartialProducts>): Promise<number> {
    let total = 0;
  
    for (const product of products) {
      
      const productPrice = await this.productsService.buyProduct(product.id);
      total += Number(productPrice);
      console.log(`Price for product ${product.id}: ${productPrice}`);
    }
  
    console.log(`Total Price  ${total}`);
    
    return total; 
  }

  async getById(id: string) {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    const orderDetail = await this.orderDetailsService.getOrderDetailsById(
      order.id,
      ['products', 'order'],
    );
    return orderDetail;
  };
};
