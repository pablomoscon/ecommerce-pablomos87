/* import { Injectable } from "@nestjs/common";
import { User } from "./users.interface";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
@Injectable()
export class UsersRepository {
    private users: User[] = [
        {
            id: 1,
            email: 'usuario1@example.com',
            name: 'Juan Pérez',
            password: 'contraseña123',
            address: 'Calle Falsa 123',
            phone: '555-1234',
            country: 'Argentina',
            city: 'Buenos Aires'
        },
        {
            id: 2,
            email: 'usuario2@example.com',
            name: 'María González',
            password: 'contraseña456',
            address: 'Avenida Siempre Viva 742',
            phone: '555-5678',
            country: 'Argentina',
            city: 'Córdoba'
        },
        {
            id: 3,
            email: 'usuario3@example.com',
            name: 'Carlos López',
            password: 'contraseña789',
            address: 'Paseo del Parque 456',
            phone: '555-9876',
            country: 'Argentina',
            city: 'Rosario'
        },
        {
            id: 4,
            email: 'usuario4@example.com',
            name: 'Lucía Martínez',
            password: 'contraseña101',
            address: 'Ruta 80 321',
            phone: '555-4321',
            country: 'Argentina',
            city: 'La Plata'
        },
        {
            id: 5,
            email: 'usuario5@example.com',
            name: 'Fernando García',
            password: 'contraseña202',
            address: 'Calle 25 de Mayo 1234',
            phone: '555-5671',
            country: 'Argentina',
            city: 'Mendoza'
        }
    ];

    async findUsers(pageNumber: number = 1, limitNumber: number = 5): Promise<User[]> {
        const startIndex = (pageNumber - 1) * limitNumber;
        const endIndex = startIndex + limitNumber;

        console.log(`StartIndex: ${startIndex}, EndIndex: ${endIndex}`);

        return this.users.slice(startIndex, endIndex);
    }

    async getById(id: number): Promise<User> {
        return this.users.find(user => user.id === id);
    }

    async createUser(createUserDto: CreateUserDto):Promise<User> {
        const newUser = { 
            id: this.users.length + 1,
            ...createUserDto, 
        };
        await this.users.push(newUser);
        return newUser;
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto) {
        const user =  await this.getById(id);
        console.log(user);
        
        const updatedUser = {
            ...user,
            ...updateUserDto,
        };
        console.log(updatedUser);
        
        this.users =  this.users.map((user) =>
            user.id === id ? updatedUser : user,
        );
        return updatedUser;
    }

    async deleteUser(id: number): Promise<User | null> {
        const userId = Number(id);
        const user = await this.users.find(user => user.id === userId);
        return user
        ? (this.users.splice(this.users.indexOf(user), 1), 
        console.log('User deleted:', user), user)
        : (console.log(`User with id ${id} not found`), null);
    }
    
    async getOneByEmail(email: string) {
        return this.users.find(user => user.email === email);
    }
} */