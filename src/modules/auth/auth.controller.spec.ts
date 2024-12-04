import { Test, TestingModule } from "@nestjs/testing";
import { SignupAuthDto } from "../auth/dto/signup-auth.dto";
import { SignInAuthDto } from "../auth/dto/signin-auth.dto";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";
import { AuthController } from "./auth.controller";
import { Role } from "../users/enum/roles.enum";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AuthResponseDto } from "./dto/response-auth.dto";

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {

        const hashedPassword = await bcrypt.hash('123456', 10);
        const mockUserService: Partial<UsersService> = {

            findByEmail: (email: string) => {
                if (email === 'johndou@email.com') {
                    return Promise.resolve({
                        password: hashedPassword,
                        email: 'johndou@email.com',
                        role: 'user',
                    });
                } else {

                    return Promise.resolve(undefined);
                }
            },

            createUser: (entityLike?: Partial<User>) => {
                return Promise.resolve({
                    ...entityLike,
                    role: Role.User,
                    id: '1234fs-1234fs-1234fs-1234fs',
                } as User);
            },
        };
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useValue:
                        {},
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: () => Promise.resolve('mockJwtToken'),
                    },
                },
                {
                    provide: UsersService,
                    useValue: mockUserService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    const mockSignUpUser = new SignupAuthDto({
        name: 'John Doe',
        createdAt: '26/02/2024',
        password: '123456',
        confirmPassword: '123456',
        email: 'newuser@email.com',
        address: 'Fake St. 123',
        phone: '123456789',
        city: 'Paris',
        country: 'France'
    });

    const mockSignInUser = new SignInAuthDto({
        email: 'johndou@email.com',
        password: '123456',
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('signUp() should return a new UserResponseDto and create User', async () => {

        const mockRequest = { date: new Date() };
        const user = await controller.createUser(mockSignUpUser, mockRequest);


        console.log('SignUp test:', user);

        expect(user).toBeDefined();
        expect(user).toBeInstanceOf(AuthResponseDto);
        expect(user).toHaveProperty('id');
    });

    it('signIn() should return a token', async () => {

        const token = await controller.authLogin(mockSignInUser);

        expect(token).toBeDefined();
        expect(token).toHaveProperty('token');
    });
});

