import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';


let users = [
  { id: '1234fs-1234fs-1234fs-1234fs', name: 'User 1', email: 'user1@email.com' },
  { id: '1234fs-1234fs-1234fs-1235fs', name: 'User 2', email: 'user2@email.com' },
];

const mockUsersRepository = {
  find: ({ skip, take }: { skip: number; take: number }) => {
    return Promise.resolve(users.slice(skip, skip + take));
  },
  findOne: ({ where }: { where: { id: string } }) => {
    const user = users.find((u) => u.id === where.id);
    return Promise.resolve(user);
  },
  create: (createUserDto: CreateUserDto) => ({
    ...createUserDto,
    id: `1234fs-1234fs-1234fs-1236fs`,
  }),
  save: (user: User) => {
    users.push(user);
    return Promise.resolve(user);
  },
  update: (id: string, updateUserDto: UpdateUserDto) => {
    const user = users.find((u) => u.id === id);
  if (!user) return Promise.resolve(null);

  const updatedUser = { ...user, ...updateUserDto };

  users = users.map((u) => (u.id === id ? updatedUser : u));
  return Promise.resolve(updatedUser);
  },
  delete: (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) {
      return Promise.resolve({ deleted: false, id });
    }
    users = users.filter((u) => u.id !== id);
    return Promise.resolve({ deleted: true, id });
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository, // Usamos el mock con funciones asignadas
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the correct user based on the id', async () => {
    const userId = '1234fs-1234fs-1234fs-1235fs'; 
  
  
    const user = await service.findUsersById(userId);
  
    expect(user).toBeDefined(); 
    expect(user?.id).toBe(userId); 
  });
  
  it('should return undefined if the user does not exist', async () => {
    const userId = '1';
  
    const user = await service.findUsersById(userId);
  
    expect(user).toBeUndefined();
  });

  it('should create and return a user when valid data is provided', async () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      address: '123 Main St',
      phone: '1234567890',
      country: 'USA',
      city: 'New York',
      createdAt: '2024-11-21T00:00:00Z',
    };

    const mockUser = {
      id: '1234fs-1234fs-1234fs-1236fs', 
      ...createUserDto,
    };

    mockUsersRepository.create(createUserDto);
    const result = await service.createUser(createUserDto);

    expect(result).toEqual(mockUser); 
  });

  it('should update and return the user when valid data is provided', async () => {
    const userId = '1234fs-1234fs-1234fs-1234fs';
    const updateUserDto: UpdateUserDto = {
      name: 'Updated User 1',
      email: 'user-updated@email.com',
    };
  
    const updatedUser = {
      id: userId,
      ...updateUserDto,
    };
  
    const result = await service.updateUser(userId, updateUserDto);
  
    expect(result).toEqual(updatedUser);
  });

  it('should delete a user and return the correct response', async () => {
    const userId = '1234fs-1234fs-1234fs-1234fs'; // ID del usuario existente
    const initialUsersLength = users.length;
  
    const result = await service.deleteUser(userId);
  
    expect(result).toEqual({ deleted: true, id: userId });
    expect(users.length).toBe(initialUsersLength - 1); // Verifica que el usuario se eliminó
    expect(users.find((u) => u.id === userId)).toBeUndefined(); // Verifica que no exista en la lista
  });
  
  it('should return deleted: false when trying to delete a non-existing user', async () => {
    const nonExistingId = 'non-existing-id'; // ID de un usuario inexistente
    const initialUsersLength = users.length;
  
    const result = await service.deleteUser(nonExistingId);
  
    expect(result).toEqual({ deleted: false, id: nonExistingId });
    expect(users.length).toBe(initialUsersLength); // Verifica que no se eliminó ningún usuario
  });
  
});