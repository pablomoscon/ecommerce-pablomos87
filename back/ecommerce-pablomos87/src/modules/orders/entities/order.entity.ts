import { OrderDetail } from "src/modules/order-details/entities/order-detail.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ })
    date: Date;

    @ManyToOne (() => User, (user) => user.orders)
    user: User;

    @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order)
    @JoinColumn() 
    orderDetails: OrderDetail;
}

