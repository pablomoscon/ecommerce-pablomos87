import { Controller, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";


@Controller('auth')
export class AuthController {
    constructor (private readonly AuthService: AuthService ) {}

    @Get()
    getAllAuth() {
    return this.AuthService.getAuth();
}
}
