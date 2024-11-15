import { Order } from "src/modules/orders/entities/order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enum/roles.enum";

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

  @Column({type: 'enum', enum: Role, default: Role.User})
  administrator: Role;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[]; 
}
