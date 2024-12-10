import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category {
    @ApiProperty({
        description: 'The unique identifier for the category',
        example: 'd4f7a1e5-894e-4e2a-9f3a-1f9a6c8df3e4',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'The name of the category',
        example: 'Electronics',
    })
    @Column({ length: 50 })
    name: string;

    @ApiProperty({
        description: 'The associated products for this category',
        type: () => Product,
        isArray: true,
    })
    @OneToMany(() => Product, (product) => product.category)
    product: Product[];
}