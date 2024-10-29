import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { User } from "./users.interface";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {

    constructor(private UsersRepository: UsersRepository) { }

    async getUsers(pageNumber: number, limitNumber: number) {
        return this.UsersRepository.getUsers(pageNumber, limitNumber);
    }
    async getUsersById(id: number) {
        return this.UsersRepository.getById(id)
    }
    async createUser(createUserDto: CreateUserDto) {
        return await this.UsersRepository.createUser(createUserDto);
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto) {
        return this.UsersRepository.updateUser(id, updateUserDto);
    }
    async deleteUser(id: number) {
        return await this.UsersRepository.deleteUser(id)
    }
    async getByEmail(email: string) {
        return await this.UsersRepository.getOneByEmail(email)
    }
}