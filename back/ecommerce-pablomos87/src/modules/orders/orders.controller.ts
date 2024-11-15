import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/response-order-dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard)
  async addOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const newOrder = await this.ordersService.addOrder(createOrderDto);
      return new OrderResponseDto(newOrder);
    } catch (error) {
      throw new HttpException(
        'Error adding order',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getOrderById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      const order = await this.ordersService.getById(id);
      if (!order) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }
      return order;
    } catch (error) {
      throw new HttpException(
        'Error fetching order',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
};
