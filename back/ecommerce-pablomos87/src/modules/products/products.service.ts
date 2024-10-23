import { Injectable } from "@nestjs/common";
import { ProductsRepository } from './products.repository';
import { Product } from "./products.interface";
@Injectable()
export class ProductsService {
   
    constructor (private ProductsRepository: ProductsRepository) {}
    async getProducts (pageNumber: number, limitNumber: number) {
        return await this.ProductsRepository.getProducts(pageNumber, limitNumber)
    }

    async getById (id: number) {
        return await this.ProductsRepository.getById(id)
     }
     async addProduct(productData: Omit <Product, 'id'>):Promise <Product> {
            return await this.ProductsRepository.addProduct(productData);
          }
     async updateProduct(id: number, productData: Omit <Product, 'id'>) {
        return await this.ProductsRepository.updateProduct(id, productData);
    }
    async deleteProduct (id:number){
        return await this.ProductsRepository.deleteProduct(id)
    }

};