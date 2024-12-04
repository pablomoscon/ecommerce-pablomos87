import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UsersService } from '../users/users.service';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from '../products/products.service';
import { UsersModule } from '../users/users.module';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { OrderDetail } from '../order-details/entities/order-detail.entity';
import { OrderDetailsService } from '../order-details/order-details.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, User, Product]),
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderDetailsService, UsersService, ProductsService],
})
export class OrdersModule { }
