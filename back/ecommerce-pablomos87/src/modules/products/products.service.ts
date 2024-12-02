import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
    ) { }

    async findProducts(pageNumber: number, limitNumber: number) {
        return await this.productsRepository.find({
            skip: (pageNumber - 1) * limitNumber,
            take: limitNumber,
        });
    };

    async findProductsById(id: string) {
        return await this.productsRepository.findOneBy({ id });
    };

    async findProductsByIds(productIds: string[]): Promise<Product[]> {
        return this.productsRepository.findByIds(productIds);
    };

    async addProduct(createProductDto: CreateProductDto): Promise<Product> {
        const newProduct = await this.productsRepository.create(createProductDto);
        return this.productsRepository.save(newProduct);
    };

    async updateProduct(id: string, updateProductDto: UpdateProductDto) {
        const updateResult = await this.productsRepository.update(id, updateProductDto);
    
        if (updateResult.affected === 0) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    
        return await this.findProductsById(id);
    };

    async deleteProduct(id: string) {
        return await this.productsRepository.delete(id)
    };

    async buyProduct(id: string) {
        const product = await this.productsRepository.findOneBy({ id });

        if (product.stock === 0) {
            throw new Error('Out of stock');
        }

        await this.productsRepository.update(id, {
            stock: product.stock - 1,
        });

        console.log('Product bought successfully');
        return product.price;
    }
};