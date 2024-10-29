import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import {v4 as uuid } from 'uuid';
import { Order } from './order.entity';
import { Product } from 'src/modules/products/entities/product.entity';

@Entity()
export class OrderDetails {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();

    @Column({type: 'decimal', precision: 10, scale: 2})
    price: number;

    @OneToOne(() => Order, order => order.orderDetails)
    order: Order;
    
    @ManyToMany(() => Product, (product) => product.orderDetails)
    @JoinTable()
    product: Product[]
};