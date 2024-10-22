import { Injectable } from "@nestjs/common";


@Injectable()
export class UsersRepository {
    private users = [
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
    ]
    
    async getUsers() {
        return this.users
    }
    
    async getById (id: number) {
      return this.users.find(user => user.id === id)
    }

    async createUser (user) {
      const id = this.users.length + 1;
      this.users = [... this.users, {id, ...user }];
      return user;
    }
};