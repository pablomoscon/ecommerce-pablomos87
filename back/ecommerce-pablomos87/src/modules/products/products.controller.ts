import { Controller, Get, Post, Put, Delete, UseGuards, HttpStatus, Query, Res, Param, Body, HttpCode } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('products')
export class ProductsController {
    constructor(private readonly ProductsService: ProductsService) { }

    @Get()
    @HttpCode(HttpStatus.OK) 
    async getAllProducts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5,
    ) {
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        return await this.ProductsService.getProducts(pageNumber, limitNumber);
    };

    @Get(':id')
    @HttpCode(HttpStatus.OK) 
    async getProductsById(
        @Param('id') id: number) {
        return await this.ProductsService.getById(Number(id))
    };

    @Post('addProduct')
    @HttpCode(HttpStatus.CREATED) 
    async addProduct(@Body() createProductDto:CreateProductDto) {
        return await this.ProductsService.addProduct(createProductDto)
    };

    @Put(':id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK) 
    async updateProduct(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
        const updatedUser = await this.ProductsService.updateProduct(Number(id), updateProductDto)
        return updatedUser.id;
    };

    @Delete(':id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK) 
    async deleteProduct(@Param('id') id: number) {
        return await this.ProductsService.deleteProduct(Number(id)); 
    };
};