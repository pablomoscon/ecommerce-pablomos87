import { Injectable } from "@nestjs/common";
import { User } from "./users.interface";
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

    async getUsers(pageNumber: number = 1, limitNumber: number = 5): Promise<User[]> {
        const startIndex = (pageNumber - 1) * limitNumber;
        const endIndex = startIndex + limitNumber;

        console.log(`StartIndex: ${startIndex}, EndIndex: ${endIndex}`);

        return this.users.slice(startIndex, endIndex);
    }

    async getById(id: number): Promise<User | undefined> {
        return this.users.find(user => user.id === id);
    }

    async createUser(userData: Omit<User, 'id'>): Promise<User> {
        const id = this.users.length + 1;
        const newUser = { id, ...userData };
        this.users.push(newUser);
        return newUser;
    }

    async authLogin(email: String, password: String): Promise<User | null> {
        const user = this.users.find(user => user.email === email && user.password === password);
         console.log('User found:', user)
        return user || null;
    }

    async updateUser(id: number, userData: Omit<User, "id">): Promise<User | null> {
        const userId = Number(id);
        const user = await this.getById(userId);
        return user
        ? (this.users[this.users.indexOf(user)] = { ...user, ...userData }, 
           console.log('Updated user:', this.users[this.users.indexOf(user)]), 
           this.users[this.users.indexOf(user)])
        : (console.log(`User with id ${userId} not found`), null)
    }

    async deleteUser(id: number): Promise<User | null> {
        const userId = Number(id);
        const user = await this.users.find(user => user.id === userId);
        return user
        ? (this.users.splice(this.users.indexOf(user), 1), 
        console.log('User deleted:', user), user)
        : (console.log(`User with id ${id} not found`), null);
      }
}