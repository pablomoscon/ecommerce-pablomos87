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
  NotFoundException,
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
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @UseGuards(AuthGuard)
  async addOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const newOrder = await this.ordersService.addOrder(createOrderDto);
      return new OrderResponseDto(newOrder);
    } catch (error) {
      console.log('Error adding order:', error)
      throw new HttpException(
        'Error adding order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    };
  };

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOrderById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      const order = await this.ordersService.findOrderById(id);
      return order;
    } catch (error) {

      if (error instanceof NotFoundException) {
        throw error;
      }

      const responseMessage = (error as any).response?.message || 'Error fetching order'; 
      const statusCode = (error as any).status || HttpStatus.INTERNAL_SERVER_ERROR; 
      throw new HttpException(responseMessage, statusCode);
    }
  }
};