import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpException, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { isUUID } from 'class-validator';
import { OrderResponseDto } from './dto/response-order-dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async addOrder(@Body() createOrderDto: CreateOrderDto) {
    const newOrder = await this.ordersService.addOrder(createOrderDto);
    return new OrderResponseDto(newOrder);
  };

  @Get(':id')
  async getOrderById(@Param('id', new ParseUUIDPipe()) id: string) {
  
    if (!isUUID(id, 4)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    return await this.ordersService.getById(id);
  };
};
