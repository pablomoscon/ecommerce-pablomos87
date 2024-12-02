import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { UsersService } from 'src/modules/users/users.service';
import { User } from 'src/modules/users/entities/user.entity';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userService: UsersService;

  beforeEach(async () => {
    process.env.ENVIRONMENT = 'TEST';
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }) 
    .overrideProvider(UsersService) 
      .useValue({
        findByEmail: jest.fn(),
        findUsers: jest.fn(),
      })
    .compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    userService = moduleFixture.get<UsersService>(UsersService);

    const hashedPassword = await bcrypt.hash('123456', 10);

    jest.spyOn(userService, 'findByEmail').mockImplementation(async (email) => {
      if (email === 'johndou@email.com') {
        return Promise.resolve({
          id: '123',
          name: 'John Doe',
          email: 'johndou@email.com',
          password: hashedPassword,
          role: 'admin',
        } as User);
      }
      return Promise.resolve(undefined);
    });

    jest.spyOn(userService, 'findUsers').mockImplementation(async () => {
      return Promise.resolve([
        {
          email: 'johndou@email.com',
          role: 'admin',
        },
      ] as User[]);
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

  it('/users (GET) Returns array with users and OK status code', async () => {
    const req = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`);


    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array);
  });
});
