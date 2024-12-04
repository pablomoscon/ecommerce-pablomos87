import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from 'src/modules/products/entities/product.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class OrderDetail {
    @ApiProperty({
        description: 'Unique identifier for the order detail',
        example: 'uuid-of-order-detail',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Price of the order detail',
        example: 199.99,
    })
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ApiProperty({
        description: 'The order associated with the order detail',
        example: { id: 'uuid-of-order' },
    })
    @OneToOne(() => Order, (order) => order.orderDetails)
    order: Order;

    @ApiProperty({
        description: 'List of products included in the order detail',
        example: [{ id: 'uuid-of-product' }],
    })
    @ManyToMany(() => Product, (product) => product.orderDetails)
    products: Product[];
};