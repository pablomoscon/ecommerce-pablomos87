import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailsController } from '../order-details/order-details.controller';
import { CreateOrderDetailDto } from '../order-details/dto/create-order-detail.dto';
import { OrderDetailsService } from '../order-details/order-details.service';


describe('OrderDetailsController', () => {
  let controller: OrderDetailsController;
  let service: OrderDetailsService;

  const mockOrderDetailsService = {
    create: async (dto: CreateOrderDetailDto
    ) => {
      return { id: '1', ...dto };
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
    service = module.get<OrderDetailsService>(OrderDetailsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order detail successfully', async () => {
      const createOrderDetailDto: CreateOrderDetailDto = {
        price: 100,
        order: { id: '3' },
        products: [{ id: '1', quantity: 2 }],
      };

      const result = await controller.create(createOrderDetailDto);

      expect(result).toEqual({
        id: '1',
        ...createOrderDetailDto,
      });

      const serviceResult = await service.createOrderDetail(createOrderDetailDto);
      expect(serviceResult).toEqual(result);
    });

    it('should handle errors thrown by the service', async () => {
      const createOrderDetailDto: CreateOrderDetailDto = {
        price: 100,
        order: { id: '3' },
        products: [{ id: '1', quantity: 2 }],
      };

      const error = new Error('Service error');


      const originalCreate = service.createOrderDetail;
      service.createOrderDetail = async () => {
        throw error;
      };

      await expect(controller.create(createOrderDetailDto)).rejects.toThrow(
        'Service error',
      );


      service.createOrderDetail = originalCreate;
    });
  });
});
