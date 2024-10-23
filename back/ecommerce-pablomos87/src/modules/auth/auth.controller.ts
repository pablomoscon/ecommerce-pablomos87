import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";


@Controller('auth')
export class AuthController {
    constructor (private readonly AuthService: AuthService ) {}

    @Get()
    getAllAuth() {
    return this.AuthService.getAuth();
    }

    @Post('signin') 
        async authLogin (@Body() body: { email: string; password: string }, @Res() res: Response) {
            const { email, password } = body;
            const user = await this.AuthService.authLogin(email, password);
            return user 
            ? res.status(200).json(user) 
            : res.status(401).json({ message: 'Invalid credentials' });
        }
}
