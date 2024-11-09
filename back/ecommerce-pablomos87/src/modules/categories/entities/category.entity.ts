import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {

    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 50 })
    name: string;

    @ManyToOne(() => Product, (product) => product.category)
    product: Product;
}
