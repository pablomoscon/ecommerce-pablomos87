import { Category } from './../../categories/entities/category.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinTable, ManyToOne } from 'typeorm';
import { OrderDetail } from "src/modules/order-details/entities/order-detail.entity";
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product {
  @ApiProperty({
    description: 'Unique identifier for the product',
    example: 'uuid-of-product',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Wireless Headphones',
  })
  @Column({ length: 150 })
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'High-quality wireless headphones with noise cancellation.',
  })
  @Column({ length: 255 })
  description: string;

  @ApiProperty({
    description: 'Price of the product in USD',
    example: 199.99,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    description: 'Stock quantity of the product',
    example: 50,
  })
  @Column({ type: 'int', nullable: true })
  stock: number;

  @ApiProperty({
    description: 'Image URL for the product',
    example: 'https://example.com/product-image.jpg',
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWz9tftw9qculFH1gxieWkxL6rbRk_hrXTSg&s',
  })
  @Column({
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWz9tftw9qculFH1gxieWkxL6rbRk_hrXTSg&s',
  })
  imgUrl: string;

  @ApiProperty({
    description: 'Categories associated with the product',
    type: () => Category,
    isArray: true,
    example: [{ id: 'uuid-of-category' }],
  })
  @ManyToOne(() => Category, (category) => category.product)
  category: Category[];

  @ApiProperty({
    description: 'Order details associated with the product',
    type: () => OrderDetail,
    isArray: true,
    example: [{ id: 'uuid-of-order-detail' }],
  })
  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.products)
  @JoinTable()
  orderDetails: OrderDetail[];
}
