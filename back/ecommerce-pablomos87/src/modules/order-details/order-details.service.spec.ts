import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailsService } from './order-details.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetail } from './entities/order-detail.entity';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';

describe('OrderDetailsService', () => {
  let service: OrderDetailsService;
  let orderDetailsRepository: Repository<OrderDetail>;

  const mockOrderDetails: OrderDetail[] = [
    {
      id: 'order-detail-id-1',
      price: 300,
      products: [
        { id: 'product-id-1', price: 100 },
        { id: 'product-id-2', price: 200 },
      ] as Product[],
      order: { id: 'order-id-1', date: new Date(), user: { id: 'user-id-1' } as User } as Order,
    },
  ];

  beforeEach(async () => {
    const mockOrderDetailsRepository = {
      create: (dto: CreateOrderDetailDto) => {
        return { ...dto, id: `order-detail-id-${Math.random().toString(36).substr(2, 9)}` };
      },
      save: (orderDetail: OrderDetail) => {
        mockOrderDetails.push(orderDetail);
        return Promise.resolve(orderDetail);
      },
      find: ({ where, relations }: { where: any; relations: string[] }) => {
        return Promise.resolve(mockOrderDetails.filter((orderDetail) => orderDetail.order.id === where.order.id));
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderDetailsService,
        { provide: getRepositoryToken(OrderDetail), useValue: mockOrderDetailsRepository },
      ],
    }).compile();

    service = module.get<OrderDetailsService>(OrderDetailsService);
    orderDetailsRepository = module.get<Repository<OrderDetail>>(getRepositoryToken(OrderDetail));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new order detail', async () => {
    const createOrderDetailDto: CreateOrderDetailDto = {
      price: 500,
      products: [
        { id: 'product-id-3', price: 150 },
        { id: 'product-id-4', price: 350 },
      ],
      order: { id: 'order-id-2', date: new Date(), user: { id: 'user-id-2' } },
    };

    const result = await service.createOrderDetail(createOrderDetailDto);

    expect(result).toHaveProperty('id');
    expect(result.price).toBe(500);
    expect(result.products).toHaveLength(2);
  });

  it('should retrieve order details by order ID', async () => {
    const orderId = 'order-id-1';

    const result = await service.findOrderDetailsById(orderId, ['products', 'order']);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('id', 'order-detail-id-1');
    expect(result[0].products).toHaveLength(2);
  });

  it('should return an empty array if no order details are found for an order', async () => {
    const orderId = 'non-existent-order-id';

    const result = await service.findOrderDetailsById(orderId, ['products', 'order']);

    expect(result).toHaveLength(0);
  });
});