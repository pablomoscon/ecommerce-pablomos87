import { Injectable } from "@nestjs/common";
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
    constructor (private UsersRepository: UsersRepository) {}

    getAuth () {
        return 'Get all auths'
    }
    authLogin (email: String, password: String) {
        return this.UsersRepository.authLogin(email, password)
    }
};