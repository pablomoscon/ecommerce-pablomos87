import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInAuthDto } from "./dto/signin-auth.dto";


@Controller('auth')
export class AuthController {
    constructor (private readonly AuthService: AuthService ) {}

    @Get()
    getAllAuth() {
    return this.AuthService.getAuth();
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)  
        async authLogin (@Body() credentials: SignInAuthDto) {
            return this.AuthService.signIn(credentials)
        }
}
