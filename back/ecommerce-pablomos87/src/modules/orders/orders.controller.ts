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
  Logger,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/response-order-dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard)
  async addOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      this.logger.log('Adding new order...');
      const newOrder = await this.ordersService.addOrder(createOrderDto);
      this.logger.log('Order added successfully');
      return new OrderResponseDto(newOrder);
    } catch (error) {
      this.logger.error('Error adding order', error);
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
      this.logger.log(`Fetching order with id: ${id}`);
      const order = await this.ordersService.findById(id);
      if (!order) {
        this.logger.log(`Order with id: ${id} not found`);
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }
      this.logger.log(`Order with id: ${id} fetched successfully`);
      return order;
    } catch (error) {
      this.logger.error(`Error fetching order with id: ${id}`, error);
      throw new HttpException(
        'Error fetching order',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
};