import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly UsersService: UsersService) { }

    @Get()
    getAllUsers() {
        return this.UsersService.getUsers();
    }

    @Get(':id')
    getUsersById(@Params ('id') id : number ) {
        return this.UsersService.getUsersById(Number(id));
    }

    @Post()
    createUser() {
        return 'Este endpoint crea el usuario';
    }

    @Put(':id')
    updateUser( ) {
        return 'Este endpoint modifica el usuario';
    }

    @Delete(':id')
    deleteUser() {
        return 'Este endpoint elimina el usuario¡';
    }
};
function Params(arg0: string): (target: UsersController, propertyKey: "getUsersById", parameterIndex: 0) => void {
    throw new Error('Function not implemented.');
}

