import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Role } from './enum/roles.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: Partial<UsersService>;

  beforeEach(async () => {
    const mockUsersService: Partial<UsersService> = {
      findUsersById: (id: string) => {
        if (id === '1234fs-1234fs-1234fs-1234fs') {
          return Promise.resolve({
            id: '1234fs-1234fs-1234fs-1234fs',
            name: 'John Doe',
            email: 'johndoe@email.com',
            role: Role.User,
          } as User);
        }
        return Promise.resolve(undefined);
      },
      findUsers: (pageNumber: number, limitNumber: number) => {
        return Promise.resolve([
          {
            id: '1234fs-1234fs-1234fs-1234fs',
            name: 'John Doe',
            email: 'johndoe@email.com',
            role: Role.User,
          } as User,
        ]);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: () => Promise.resolve('mockJwtToken'),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  const mockNewUser = {
    name: 'Jane Doe',
    email: 'janedoe@email.com',
    password: 'password123',
    role: Role.User,
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('findUsersById() should return a user by ID', async () => {
    const user = await controller.findUsersById('1234fs-1234fs-1234fs-1234fs');
    expect(user).toBeDefined();
    expect(user).toHaveProperty('id', '1234fs-1234fs-1234fs-1234fs');
    expect(user).toHaveProperty('email', 'johndoe@email.com');
  });


  it('findUsersById() should throw an exception for a non-existing user', async () => {
    await expect(controller.findUsersById('non-existing-id'))
      .rejects
      .toThrow(HttpException);
  });
});