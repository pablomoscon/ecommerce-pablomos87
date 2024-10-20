import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
    constructor (private UsersRepository: UsersRepository) {}
    getUsers () {
        return this.UsersRepository.getUsers()
    }
};