import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
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
        return await this.UsersService.getUsers(pageNumber, limitNumber);
    };


@Post('register')
   @HttpCode(HttpStatus.CREATED) 
   createUser(@Body() createUserDto: CreateUserDto) {
    return this.UsersService.createUser(createUserDto);
}
   
   @Get(':id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK) 
    async getUsersById(@Param('id') id: number) {
        const user = await this.UsersService.getUsersById(Number(id));
        return new UserResponseDto(user)
    };

    @Put(':id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK) 
    async updateUser(@Param('id') id: number,@Body() updateUserDto: UpdateUserDto) {
        const updatedUser = await this.UsersService.updateUser(Number(id), updateUserDto)
        return updatedUser.id;
    };

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteUser(@Param('id') id: number) {
        return await this.UsersService.deleteUser(Number(id));
    }
};
