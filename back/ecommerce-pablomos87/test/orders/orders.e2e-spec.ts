import { OrdersService } from 'src/modules/orders/orders.service';
import { INestApplication, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { UsersService } from "src/modules/users/users.service";
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';

describe('OrdersController (e2e)', () => {
    let app: INestApplication;
    let ordersService: OrdersService; 
    let usersService: UsersService;
    let authToken: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule], 
        })
        .overrideProvider(OrdersService)
        .useValue({
          addOrder: jest.fn().mockResolvedValue({
            id: '123e4567-e89b-12d3-a456-426614174000', 
            price: 100,
            order: {
              id: '987f1234-a89c-45d3-b789-654321abcdef',
              date: new Date(),
              user: { id: '1' },
            },
            products: [{ id: 'product-uuid-1234' }], 
          }),
          findOrderById: jest.fn().mockResolvedValue({
            id: '123e4567-e89b-12d3-a456-426614174000', 
            price: 100, 
            date: new Date(),
            user: { id: '1' },
            orderDetails: {
              id: '1',
              order: { id: '123e4567-e89b-12d3-a456-426614174000' },
            },
          }),
        })
            .overrideProvider(UsersService)
            .useValue({
                findUsersById: jest.fn().mockResolvedValue({ id: '1', name: 'Test User' }),
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

    it('should create an order', async () => {
      const createOrderDto = {
        userId: '1',
        products: [{ id: 'product-uuid-1234' }],
      };
  
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
      
        const response = await request(app.getHttpServer())
          .get(`/orders/${orderId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
      
        expect(response.body).toHaveProperty('id', orderId);
        expect(response.body.price).toBe(100);
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

    afterAll(async () => {
      await app.close();
  });
});
