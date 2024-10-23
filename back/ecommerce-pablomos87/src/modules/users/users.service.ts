import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { User } from "./users.interface";

@Injectable()
export class UsersService {
   
    constructor (private UsersRepository: UsersRepository) {}
    
    async getUsers(pageNumber: number, limitNumber: number) {  
        return this.UsersRepository.getUsers(pageNumber, limitNumber);
    }
    async getUsersById  (id: number) {
       return this.UsersRepository.getById(id)
    }
    async createUser(userData: Omit<User, 'id'>): Promise<User> {
        return await this.UsersRepository.createUser(userData);
      }

    async  updateUser(id: number, userData: Omit<User, "id">) {
       return this.UsersRepository.updateUser(id, userData);
    }
    async deleteUser (id:number){
        return await this.UsersRepository.deleteUser(id)
    }

    }