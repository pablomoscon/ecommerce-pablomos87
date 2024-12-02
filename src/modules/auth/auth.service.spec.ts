import { JwtService } from "@nestjs/jwt";
import { Role } from "../users/enum/roles.enum";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { SignupAuthDto } from "./dto/signup-auth.dto";
import { SignInAuthDto } from "./dto/signin-auth.dto";
import { User } from "../users/entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from 'bcrypt';
import { BadRequestException } from "@nestjs/common";

let service: AuthService;
let mockUser: SignupAuthDto;
let mockUserService: Partial<UsersService>;
let mockJwtService: Partial<JwtService>; 

beforeEach(async () => {
  mockUserService = {
    findByEmail: () => Promise.resolve(undefined),
    createUser: (entityLike?: Partial<User>) =>
      Promise.resolve({
        ...entityLike,
        role: Role.User,
        id: '1234fs-1234fs-1234fs-1234fs',
      } as User),
  };

  mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('jwt-token'),
  };

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      AuthService,
      { provide: getRepositoryToken(User), useValue: {} },
      { provide: JwtService, useValue: mockJwtService },
      { provide: UsersService, useValue: mockUserService },
    ],
  }).compile();

  service = module.get<AuthService>(AuthService);

  mockUser = {
    name: 'John Doe',
    createdAt: '26/02/2024',
    password: '123456',
    confirmPassword: '123456',
    email: 'johndoe@email.com',
    address: 'Fake St. 123',
    phone: '123456789',
  } as SignupAuthDto;
});

it('should be defined', () => {
  expect(service).toBeDefined();
});

it('signUp() creates a new user with encrypted password', async () => {
  const user = await service.signUp(mockUser);
  console.log(user);
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('rol', Role.User);
  expect(user).toHaveProperty('password');
});

it('signUp() throws an error if the email is already in use', async () => {
  mockUserService.findByEmail = (email: string) => Promise.resolve({
    id: '1234fs-1234fs-1234fs-1234fs',
    role: Role.User,
    email: mockUser.email,
    password: mockUser.password,
    name: mockUser.name,
    phone: mockUser.phone,
    address: mockUser.address,
    createdAt: mockUser.createdAt,
  } as User);

  try {
    await service.signUp(mockUser);
  } catch (error) {
    expect(error.message).toEqual('User already exists');
  }
});

it('signIn() throws an error if the email is not found', async () => {
  const signInDto: SignInAuthDto = { email: 'notfound@email.com', password: '123456' };

  try {
    await service.signin(signInDto);
  } catch (error) {
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error.message).toEqual('Invalid credentials');
  }
});

it('signIn() returns an error if the password is invalid', async () => {
  const passwordHash = await bcrypt.hash('123456', 10);
  mockUserService.findByEmail = (email: string) => 
    Promise.resolve({
      id: '1234fs-1234fs-1234fs-1234fs',
      role: Role.User,
      email: mockUser.email,
      password: passwordHash, 
      name: mockUser.name,
      phone: mockUser.phone,
      address: mockUser.address,
      createdAt: mockUser.createdAt,
    } as User);

  const signInDto: SignInAuthDto = {
    email: mockUser.email,
    password: 'Invalid credentials', 
  };

  try {
    await service.signin(signInDto);
  } catch (error) {
    expect(error.message).toEqual('Invalid credentials');
  }
});

it('signIn() returns a JWT token if credentials are correct', async () => {
  const passwordHash = await bcrypt.hash('123456', 10);
  mockUserService.findByEmail = (email: string) =>
    Promise.resolve({
      id: '1234fs-1234fs-1234fs-1234fs',
      role: Role.User,
      email: mockUser.email,
      password: passwordHash, 
      name: mockUser.name,
      phone: mockUser.phone,
      address: mockUser.address,
      createdAt: mockUser.createdAt,
    } as User);

  const signInDto: SignInAuthDto = { email: mockUser.email, password: '123456' };

  const token = await service.signin(signInDto);
  expect(mockJwtService.signAsync).toHaveBeenCalledWith({
    sub: expect.any(String),
    id: expect.any(String),
    email: mockUser.email,
    rol: Role.User,
  });
  expect(token).toBe('jwt-token');
});