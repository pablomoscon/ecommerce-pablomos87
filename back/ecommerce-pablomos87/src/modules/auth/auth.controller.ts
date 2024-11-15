import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { AuthResponseDto } from './dto/response-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() signUpUser: SignupAuthDto) {
        try {
            const newUser = await this.authService.signUp(signUpUser);
            return {
                success: 'User registered successfully',
                response: new AuthResponseDto(newUser),
            }
        } catch (error) {
            if (error instanceof HttpException) { throw error; } throw new HttpException('Error registering user', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    };

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async authLogin(@Body() credentials: SignInAuthDto) {
        try {
            const token = await this.authService.signin(credentials);
            return {
                success: 'User login successfully',
                token
            };
        } catch(error) { 
            if (error instanceof HttpException) { throw error; } throw new HttpException('Error logging in user', HttpStatus.INTERNAL_SERVER_ERROR                
            ); 
        }
    };
};

