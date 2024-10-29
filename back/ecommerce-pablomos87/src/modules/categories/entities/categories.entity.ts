import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {v4 as uuid } from 'uuid';

@Entity()
export class Categories {

    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();
  
    @Column({ length: 50 })
    name: string;

    @ManyToOne(() => Product, (product) => product.categories)
    product: Product;
}
