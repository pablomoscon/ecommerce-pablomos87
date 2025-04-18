import { Injectable } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) { }

    async findUsers(pageNumber: number, limitNumber: number) {
        return await this.usersRepository.find({
            skip: (pageNumber - 1) * limitNumber,
            take: limitNumber,
            relations: ['orders'],
        });
    };

    async findUsersById(id: string) {
        return await this.usersRepository.findOne({
            where: { id },
            relations: ['orders'],
        });
    };

    async createUser(createUserDto: CreateUserDto) {
        const newUser = this.usersRepository.create(createUserDto);
        return await this.usersRepository.save(newUser);
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        await this.usersRepository.update(id, updateUserDto);
        return await this.findUsersById(id);
    }

    async deleteUser(id: string) {
        return await this.usersRepository.delete(id);
    }

    async findByEmail(email: string) {
        const user = await this.usersRepository.findOne({ where: { email } });
        return user;
    }
};