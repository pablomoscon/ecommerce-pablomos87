import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailsController } from './order-details.controller';
import { OrderDetailsService } from './order-details.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';

describe('OrderDetailsController', () => {
  let controller: OrderDetailsController;

  const mockOrderDetailsService = {
    create: async (dto: CreateOrderDetailDto) => {
      if (!dto.order) {
        throw new Error('Invalid data: order is required');
      }
      return { id: 1, ...dto };
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderDetailsController],
      providers: [
        {
          provide: OrderDetailsService,
          useValue: mockOrderDetailsService,
        },
      ],
    }).compile();

    controller = module.get<OrderDetailsController>(OrderDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order detail successfully', async () => {
      const createOrderDetailDto: CreateOrderDetailDto = {
        price: 100,
        order: { id: 3 },
        products: [{ id: 1, quantity: 2 }],
      };

      const result = await controller.create(createOrderDetailDto);

      expect(result).toEqual({
        id: 1,
        ...createOrderDetailDto,
      });
    });

    it('should throw an error if invalid data is provided', async () => {
      const createOrderDetailDto: CreateOrderDetailDto = {
        price: 100,
        order: null,
        products: [{ id: 1, quantity: 2 }],
      };
      await expect(controller.create(createOrderDetailDto)).rejects.toThrow('Invalid data: order is required');
    });
  });
});