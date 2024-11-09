import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { isUUID } from 'class-validator';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly UsersService: UsersService) { }

    @Get()
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async getAllUsers(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5,
    ) {
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const users = await this.UsersService.getUsers(pageNumber, limitNumber);
        return users.map(user => new UserResponseDto(user));
    };


    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.UsersService.createUser(createUserDto);
    };

    @Get(':id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async getUsersById(@Param('id', new ParseUUIDPipe()) id: string) {
        if (!isUUID(id, 4)) {
            throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
        };
        const user = await this.UsersService.getUsersById(id);
        return new UserResponseDto(user)
    };

    @Put(':id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async updateUser(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateUserDto: UpdateUserDto) {
        if (!isUUID(id, 4)) {
            throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
        };
        const updatedUser = await this.UsersService.updateUser(id, updateUserDto);
        return updatedUser.id;
    };

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
        if (!isUUID(id, 4)) {
            throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
        };
        return await this.UsersService.deleteUser(id);
    }
};
