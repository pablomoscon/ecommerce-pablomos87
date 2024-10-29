import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import {v4 as uuid } from 'uuid';
import { OrderDetails } from "./orderDetails.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();

    @Column({ })
    date: Date;

    @ManyToOne (() => User, (user) => user.orders)
    user: User;

    @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.order)
    @JoinColumn() 
    orderDetails: OrderDetails;
}


/* id: debe ser un valor único generado automáticamente en formato UUID. No puede ser nulo y actúa como la clave primaria de la entidad.

user_id:  (Relación 1:N) con users.

date.

Relación 1:1 con orderDetails. */