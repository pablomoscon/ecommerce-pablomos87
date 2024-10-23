import { Controller, Get, Post, Put, Delete, UseGuards, HttpStatus, Query, Res, Param, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';
import { Product } from './products.interface';

@Controller('products')
export class ProductsController {
    constructor(private readonly ProductsService: ProductsService) { }

    @Get()
    async getAllProducts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5,
        @Res() res: Response
    ) {
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const products = await this.ProductsService.getProducts(pageNumber, limitNumber);
        return res.status(HttpStatus.OK).json(products);
    };

    @Get(':id')
    async getProductsById(
        @Param('id') id: number,
        @Res() res: Response) {
        const product = await this.ProductsService.getById(Number(id));
        return product
        ? res.status(HttpStatus.OK).json(product)
        : res.status(400).json({ message: 'Product not found' });
    };

    @Post('addProduct')
    async createUser(@Body() productData: Omit<Product, 'id'>, @Res() res: Response) {
        const newProduct = await this.ProductsService.addProduct(productData);
        return res.status(HttpStatus.CREATED).json(`product_id: ${newProduct.id}`);
    };

    @Put(':id')
    @UseGuards(AuthGuard)
    async updateProduct(@Param('id') id: number, @Body() productData: Omit<Product, 'id'>, @Res() res: Response) {
        const updatedUser = await this.ProductsService.updateProduct(id, productData)
        console.log(`ìd:${id}`);
        return res.status(HttpStatus.OK).json(`product_id: ${id}`);
    };

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteProduct(@Param('id') id: number, @Res() res: Response) {
        const deletedProduct = await this.ProductsService.deleteProduct(Number(id));
        return deletedProduct
        ? res.status(HttpStatus.OK).json(`id: ${id}`)
        : res.status(400).json({ message: 'Product not found' });
    };
};