import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { User } from './users.interface';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly UsersService: UsersService) { }

    @Get()
    @UseGuards(AuthGuard)

    async getAllUsers(
        @Query('page') page: number = 1, 
        @Query('limit') limit: number = 5, 
        @Res() res: Response
    ) {
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const users = await this.UsersService.getUsers(pageNumber, limitNumber);
        return res.status(HttpStatus.OK).json(users);
    };

    @Get(':id')
    @UseGuards(AuthGuard)
    async getUsersById(@Param('id') id: number, @Res() res: Response) {
        const user = await this.UsersService.getUsersById(Number(id));
        return user 
        ? res.status(HttpStatus.OK).json(user) 
        : res.status(400).json({ message: 'User not found' });
    };

    @Post('register')
    async createUser(@Body() userData: Omit<User, 'id'>, @Res() res: Response) {
        const newUser = await this.UsersService.createUser(userData);
        return res.status(HttpStatus.CREATED).json(`user_id: ${newUser.id}`);
    };

    @Put(':id')
    @UseGuards(AuthGuard)
    async updateUser(@Param('id') id: number,@Body() userData: Omit <User, 'id'>, @Res() res: Response) {
        const updatedUser = await this.UsersService.updateUser(id, userData)
        return res.status(HttpStatus.OK).json(/* `id: ${id}` */updatedUser);
    };

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteUser(@Param('id') id: number, @Res() res: Response) {
        const deletedUser = await this.UsersService.deleteUser(Number(id));
        return deletedUser
        ? res.status(HttpStatus.OK).json(`id: ${id}`)
        : res.status(400).json({ message: 'User not found' });
    }
};
