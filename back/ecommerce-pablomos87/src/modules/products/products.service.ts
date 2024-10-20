import { Injectable } from "@nestjs/common";
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
    constructor (private ProductsRepository: ProductsRepository) {}
    getProducts () {
        return this.ProductsRepository.getProducts()
    }
};