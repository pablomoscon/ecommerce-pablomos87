import { OrderDetail } from "src/modules/order-details/entities/order-detail.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Order {
    @ApiProperty({
        description: 'Unique identifier for the order',
        example: 'uuid-of-order',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Date when the order was placed',
        example: '2024-12-01T12:00:00Z',
    })
    @Column({ nullable: false })
    date: Date;

    @ApiProperty({
        description: 'User who placed the order',
        example: { id: 'uuid-of-user' },
    })
    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @ApiProperty({
        description: 'Details of the order',
        example: { id: 'uuid-of-order-detail' },
    })
    @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order)
    @JoinColumn()
    orderDetails: OrderDetail;
};