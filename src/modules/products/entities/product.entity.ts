import { Category } from './../../categories/entities/category.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import { OrderDetail } from "src/modules/order-details/entities/order-detail.entity";


@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 150 })
    name: string;
  
    @Column({ length: 255 })
    description: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 }) 
    price: number;
  
    @Column({ type: 'int', nullable: true })
    stock: number;
  
    @Column({ default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWz9tftw9qculFH1gxieWkxL6rbRk_hrXTSg&s' })
    imgUrl: string;

    @OneToMany(() => Category, (category) => category.product)
    category: Category[];

    @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.products)
    @JoinTable()
    orderDetails: OrderDetail[];
}
