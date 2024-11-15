import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpStatus, HttpException } from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { isUUID } from 'class-validator';

@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Post()
 async create(@Body() createOrderDetailDto: CreateOrderDetailDto) {
  try {
    return await this.orderDetailsService.create(createOrderDetailDto);
  } catch (error) {
    throw error;
    }
};

};