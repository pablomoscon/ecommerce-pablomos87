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
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/modules/users/enum/roles.enum';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    async findAllUsers(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '5',
    ) {
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const users = await this.usersService.findUsers(pageNumber, limitNumber);
        return users.map((user) => new UserResponseDto(user, true));
    };

    @Get(':id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async findUsersById(@Param('id', new ParseUUIDPipe()) id: string) {
            try {
                const user = await this.usersService.findUsersById(id);
                if (!user) {
                    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
                }
                return new UserResponseDto(user);
            } catch (error) {
                throw new HttpException(
                    'Error fetching user',
                    error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                );
        }
    };

    @Put(':id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async updateUser(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        try {
            const updatedUser = await this.usersService.updateUser(id, updateUserDto);
            return updatedUser.id;
        } catch (error) {
            throw new HttpException(
                'Error updating user',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    };

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        try {
            await this.usersService.deleteUser(id);
            return { success: 'User deleted successfully' };
        } catch (error) {
            throw new HttpException(
                'Error deleting user',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
};

/*   @Post('register')
    @HttpCode(HttpStatus.CREATED)
    createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }; */
