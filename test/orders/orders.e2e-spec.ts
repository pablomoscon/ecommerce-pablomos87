import { OrdersService } from 'src/modules/orders/orders.service';
import { INestApplication, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { UsersService } from "src/modules/users/users.service";
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/users/entities/user.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Order } from 'src/modules/orders/entities/order.entity';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let ordersService: OrdersService;
  let usersService: UsersService;
  let authToken: string;

  beforeEach(async () => {
    process.env.ENVIRONMENT = 'TEST';
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OrdersService)
      .useValue({
        addOrder: jest.fn(),
        findOrderById: jest.fn()
      })
      .overrideProvider(UsersService)
      .useValue({
        findUsersById: jest.fn(),
        findByEmail: jest.fn(),
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    ordersService = moduleRef.get<OrdersService>(OrdersService);
    usersService = moduleRef.get<UsersService>(UsersService);

    const hashedPassword = await bcrypt.hash('123456', 10);

    jest.spyOn(usersService, 'findByEmail').mockImplementation(async (email) => {
      if (email === 'johndou@email.com') {
        return Promise.resolve({
          id: '123',
          name: 'John Doe',
          email: 'johndou@email.com',
          password: hashedPassword,
          role: 'admin',
        });
      }
      return Promise.resolve(undefined);
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'johndou@email.com',
        password: '123456',
      });

    authToken = loginResponse.body['token'];
  });

  afterEach(async () => {
    await app.close();
  });

  it('should create an order', async () => {
    const createOrderDto = {
      userId: '1',
      products: [{ id: 'product-uuid-1234' }],
    };

    jest.spyOn(ordersService, 'addOrder').mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      price: 100,
      order: {
        id: '987f1234-a89c-45d3-b789-654321abcdef',
        date: new Date(),
        user: { id: '1' } as User,
      } as Order,
      products: [{ id: 'product-uuid-1234' } as Product],
    });

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send(createOrderDto)
      .expect(201);

    expect(response.body).toHaveProperty('id', '123e4567-e89b-12d3-a456-426614174000');
    expect(response.body.price).toBe(100);
    expect(response.body).toHaveProperty('order');
    expect(response.body.order).toHaveProperty('id', '987f1234-a89c-45d3-b789-654321abcdef');
    expect(response.body.order.user).toHaveProperty('id', '1');
  });

  it('should get order by id', async () => {
    const orderId = '123e4567-e89b-12d3-a456-426614174000';

    jest.spyOn(ordersService, 'findOrderById').mockResolvedValue([
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        price: 100,
        order: {
          id: '987f1234-a89c-45d3-b789-654321abcdef',
          date: new Date(),
        } as Order,
        products: [
          { id: '1', name: 'Product 1', price: 50 },
          { id: '2', name: 'Product 2', price: 50 },
        ] as Product[],
      },
    ]);

    const response = await request(app.getHttpServer())
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body[0]).toHaveProperty('id', orderId);
    expect(response.body[0].price).toBe(100);
  });

  it('should return 404 when order is not found', async () => {
    const orderId = '00000000-0000-0000-0000-000000000000';

    jest.spyOn(ordersService, 'findOrderById').mockRejectedValueOnce(
      new NotFoundException(`Order with id ${orderId} not found`)
    );

    const response = await request(app.getHttpServer())
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);

    expect(response.body).toHaveProperty('message', `Order with id ${orderId} not found`);
  });
});
