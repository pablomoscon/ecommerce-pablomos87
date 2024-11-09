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
    return await this.orderDetailsService.create(createOrderDetailDto);
  }

  @Get()
  async findAll() {
    return await this.orderDetailsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!isUUID(id, 4)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    return await this.orderDetailsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateOrderDetailDto: UpdateOrderDetailDto) {
    if (!isUUID(id, 4)) {
      throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
    }
    return await this.orderDetailsService.update(+id, updateOrderDetailDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.orderDetailsService.remove(+id);
  }
}
