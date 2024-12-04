import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enum/roles.enum";
import { Order } from "src/modules/orders/entities/order.entity";
import { ApiProperty } from '@nestjs/swagger';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development.local' });

@Entity()
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 'uuid-of-user',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
    uniqueItems: true,
  })
  @Column({ length: 50, unique: true })
  email: string;

  @ApiProperty({
    description: 'The password for the user',
    example: 'Password123!',
  })
  @Column()
  password: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
  })
  @Column({ length: 50 })
  phone: string;

  @ApiProperty({
    description: 'The country of the user',
    example: 'United States',
    required: false,
  })
  @Column({ length: 50, nullable: true })
  country: string;

  @ApiProperty({
    description: 'The address of the user',
    example: '123 Main St, Springfield',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  address: string;

  @ApiProperty({
    description: 'The city of the user',
    example: 'New York',
    required: false,
  })
  @Column({ length: 50, nullable: true })
  city: string;

  @ApiProperty({
    description: 'The account creation date of the user (optional)',
    example: '2024-12-03T14:00:00Z',
    required: false,
  })
  @Column({ length: 50, nullable: true })
  createdAt: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'User',
    enum: Role,
    default: Role.User,
  })
  @Column(
    process.env.NODE_ENV === 'test'
      ? { type: 'text', default: 'User' }
      : { type: 'enum', enum: Role, default: Role.User }
  )
  role: Role;

  @ApiProperty({
    description: 'The orders placed by the user',
    type: () => Order,
    isArray: true,
    example: [{ id: 'uuid-of-order' }],
  })
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}