import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly ProductsService: ProductsService) { }

    @Get()
    getAllProducts() {
        return this.ProductsService.getProducts();
    }
    @Post()
    createProduct() {
        return 'Este endpoint crea un producto';
    }

    @Put()
    updateProduct() {
        return 'Este endpoint modifica un producto';
    }

    @Delete()
    deleteProduct() {
        return 'Este endpoint elimina un producto';
    }
}
