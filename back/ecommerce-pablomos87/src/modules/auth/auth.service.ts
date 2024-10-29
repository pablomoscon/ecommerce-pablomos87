import { Injectable } from "@nestjs/common";
import { SignInAuthDto } from "./dto/signin-auth.dto";
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor (private readonly UsersService: UsersService) {}

    getAuth () {
        return 'Get all auths'
    }

    async signIn(credentials: SignInAuthDto) {
        const user = await this.UsersService.getByEmail(credentials.email);
      
        if (user && user.password === credentials.password) {
          return 'You are logged in!';
        }
        return 'Invalid credentials';
      }
};