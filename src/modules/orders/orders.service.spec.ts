import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { OrderDetailsService } from '../order-details/order-details.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { OrderDetail } from '../order-details/entities/order-detail.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDetailDto } from '../order-details/dto/create-order-detail.dto';

describe('OrdersService', () => {
  let service: OrdersService;

  let orders: Order[] = [
    {
      id: 'order-id-1',
      user: { id: 'user-id-1', name: 'User 1', email: 'user1@email.com' } as User,
      date: new Date(),
      orderDetails: {
        id: 'order-detail-id-1',
        price: 300,
        products: [
          { id: 'product-id-1', stock: 10, price: 100 } as Product,
          { id: 'product-id-2', stock: 5, price: 200 } as Product,
        ],
      } as OrderDetail,
    },
  ];

  beforeEach(async () => {
    const mockOrdersRepository = {
      create: (entityLike: Partial<Order>): Order => {
        return {
          ...entityLike,
          id: `order-id-${Math.random().toString(36).substr(2, 9)}`,
        } as Order;
      },
      save: (order: Order): Promise<Order> => {
        orders.push(order);
        return Promise.resolve(order);
      },
      findOneBy: (order: Partial<Order>): Promise<Order | undefined> => {
        const foundOrder = orders.find((o) => o.id === order.id);
        return Promise.resolve(foundOrder ?? undefined);
      },
    };

    const mockUsersService = {
      findUsersById: (id: string) => {
        if (id === 'user-id') {
          return Promise.resolve({ id: 'user-id', name: 'Test User' });
        }
        return Promise.resolve(null);
      },
    };

    const mockProductsService = {
      buyProduct: async (id: string): Promise<number> => {
        const mockProducts: Record<string, { stock: number; price: number }> = {
          'product-id-1': { stock: 10, price: 100 },
          'product-id-2': { stock: 5, price: 200 },
          'product-id-3': { stock: 0, price: 300 },
          [`product-${id}`]: { stock: 10, price: 50 },
        };

        const product = mockProducts[id];
        if (!product || product.stock === 0) {
          throw new Error('Out of stock');
        }

        product.stock -= 1;
        return product.price;
      },
    };

    const mockOrderDetailsService = {
      create: async (createOrderDetailDto: CreateOrderDetailDto): Promise<OrderDetail> => {
        return {
          ...createOrderDetailDto,
          id: 'order-detail-id',
          products: createOrderDetailDto.products.map((product) => {
            return {
              id: (product as Product).id,
              name: `Product ${(product as Product).id}`,
              price: (product as Product).price || 100,
            };
          }),
        } as OrderDetail;
      },
      findOrderDetailsById: async (orderId: string): Promise<OrderDetail[]> => {
        return [{
          id: 'order-detail-id',
          order: {
            id: 'order-id',
            date: new Date(),
            user: { id: 'user-id', name: 'Test User' } as User,
          },
          products: [
            { id: 'product-id-1', name: 'Product 1', price: 100 } as Product,
            { id: 'product-id-2', name: 'Product 2', price: 200 } as Product,
          ],
        } as OrderDetail];
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: mockOrdersRepository },
        { provide: UsersService, useValue: mockUsersService },
        { provide: ProductsService, useValue: mockProductsService },
        { provide: OrderDetailsService, useValue: mockOrderDetailsService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addOrder() creates a new order with valid DTO', async () => {
    const createOrderDto: CreateOrderDto = {
      userId: 'user-id',
      products: [{ id: 'product-id-1' }],
    };

    const result = await service.addOrder(createOrderDto);

    expect(result).toHaveProperty('id', 'order-detail-id');
    expect(result).toHaveProperty('price', 100); 
    expect(result.products).toHaveLength(1);
    expect(result.order).toHaveProperty('id');
    expect(result.order.id).toMatch(/^order-id-.+/);
  });

  it('addOrder() calculates the correct total for multiple products', async () => {
    const createOrderDto: CreateOrderDto = {
      userId: 'user-id',
      products: [{ id: 'product-id-1' }, { id: 'product-id-2' }],
    };

    const result = await service.addOrder(createOrderDto);

    expect(result).toHaveProperty('price', 300);
    expect(result.products).toHaveLength(2);
  });

  it('addOrder() fails when products are missing', async () => {
    const invalidCreateOrderDto: CreateOrderDto = {
      userId: 'user-id',
      products: [],
    };

    await expect(service.addOrder(invalidCreateOrderDto)).rejects.toThrowError(
      'Order must contain at least one product',
    );
  });

  it('addOrder() fails when user does not exist', async () => {
    const invalidCreateOrderDto: CreateOrderDto = {
      userId: 'non-existent-user-id',
      products: [{ id: 'product-id-1' }],
    };

    await expect(service.addOrder(invalidCreateOrderDto)).rejects.toThrow(
      'User with id non-existent-user-id not found',
    );
  });

  it('getById() retrieves an order and its details', async () => {
    const result = await service.findOrderById('order-id-1');

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('id', 'order-detail-id');
    expect(result[0].products).toHaveLength(2);
  });

  it('getById() throws NotFoundException if the order does not exist', async () => {
    await expect(service.findOrderById('invalid-order-id')).rejects.toThrowError(
      new NotFoundException('Order with id invalid-order-id not found'),
    );
  });

  it('calculateTotal calculates total price of products', async () => {
    const total = await service['calculateTotal']([
      { id: 'product-id-1', price: 100 } as Product,
      { id: 'product-id-2', price: 200 } as Product,
    ]);

    expect(total).toBe(300); 
  });
});
