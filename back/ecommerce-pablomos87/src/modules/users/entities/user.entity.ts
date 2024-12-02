import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enum/roles.enum";
import { Order } from "src/modules/orders/entities/order.entity";
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development.local' });
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50, unique: true })
  email: string;

  @Column({ })
  password: string;

  @Column({ length: 50 })
  phone: string;

  @Column({ length: 50, nullable: true })
  country: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 50, nullable: true })
  city: string;

  @Column({ length: 50, nullable: true })
  createdAt: string;
  
  @Column(
    process.env.NODE_ENV === 'test'
      ? { type: 'text', default: 'User' }
      : { type: 'enum', enum: Role, default: Role.User }
  )
  role: Role;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
