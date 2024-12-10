import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('order-details')
@ApiTags('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) { }

  @Post()
  async create(@Body() createOrderDetailDto: CreateOrderDetailDto) {
    try {
      return await this.orderDetailsService.createOrderDetail(createOrderDetailDto);
    } catch (error) {
        if (error instanceof HttpException) {
          throw error;
        }
        throw new HttpException(
          'Failed to create an order detail',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  };