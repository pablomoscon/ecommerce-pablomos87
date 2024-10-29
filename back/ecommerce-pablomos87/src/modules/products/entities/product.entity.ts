import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {v4 as uuid } from 'uuid';
import { OrderDetails } from "src/modules/orders/entities/orderDetails.entity";
import { Categories } from "src/modules/categories/entities/categories.entity";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();
  
    @Column({ length: 50 })
    name: string;
  
    @Column({ length: 50, unique: true })
    description: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 }) 
    price: number;
  
    @Column({ type: 'int', nullable: true })
    stock: number;
  
    @Column({ default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWz9tftw9qculFH1gxieWkxL6rbRk_hrXTSg&s' })
    imgUrl: string;

    @OneToMany(() => Categories, (categories) => categories.product)
    categories: Categories[];

    @ManyToMany(() => OrderDetails, (orderDetails) => orderDetails.product)
    orderDetails: OrderDetails[];
}
