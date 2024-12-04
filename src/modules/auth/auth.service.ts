import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import { SignInAuthDto } from "./dto/signin-auth.dto";
import { UsersService } from '../users/users.service';
import { SignupAuthDto } from "./dto/signup-auth.dto";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async signUp(signUpUser: SignupAuthDto) {
    if (signUpUser.password !== signUpUser.confirmPassword) {
      throw new HttpException('Password do not match', 400)
    }
    const user = await this.usersService.findByEmail(signUpUser.email)
    if (user) {
      throw new BadRequestException('User already exists')
    }
    signUpUser.password = await bcrypt.hash(signUpUser.password, 10)
    return this.usersService.createUser(signUpUser);
  };

  async signin(credentials: SignInAuthDto) {
    const user = await this.usersService.findByEmail(credentials.email);


    if (!user) {
      throw new BadRequestException('Invalid credentials')
    };
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials')
    };
    return await this.createToken(user)
  };

  private async createToken(user: User) {
    const payload = {
      sub: user.id,
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.signAsync(payload)
  };
};