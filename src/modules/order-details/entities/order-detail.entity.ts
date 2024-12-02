import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from 'src/modules/products/entities/product.entity';
import { Order } from 'src/modules/orders/entities/order.entity';

@Entity()
export class OrderDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string ;

    @Column({type: 'decimal', precision: 10, scale: 2})
    price: number;

    @OneToOne(() => Order, order => order.orderDetails)
    order: Order;
    
    @ManyToMany(() => Product, (product) => product.orderDetails)
    products: Product[]
};