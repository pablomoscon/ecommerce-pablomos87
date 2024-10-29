import { Injectable } from "@nestjs/common";
import { ProductsRepository } from './products.repository';
import { Product } from "./products.interface";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
@Injectable()
export class ProductsService {
   
    constructor (private ProductsRepository: ProductsRepository) {}
    async getProducts (pageNumber: number, limitNumber: number) {
        return await this.ProductsRepository.getProducts(pageNumber, limitNumber)
    }

    async getById (id: number) {
        return await this.ProductsRepository.getById(id)
     }
     async addProduct(createProductDto: CreateProductDto):Promise <Product> {
            return await this.ProductsRepository.addProduct(createProductDto);
          }
     async updateProduct(id: number, updateProductDto: UpdateProductDto) {
        return await this.ProductsRepository.updateProduct(id, updateProductDto);
    }
    async deleteProduct (id:number){
        return await this.ProductsRepository.deleteProduct(id)
    }

};