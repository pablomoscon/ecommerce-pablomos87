import { Controller, Get, Post, Put, Delete, UseGuards, HttpStatus, Query, Res, Param, Body, HttpCode, ParseUUIDPipe, HttpException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { isUUID } from 'class-validator';

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
        @Param('id', new ParseUUIDPipe()) id: string) {
        if (!isUUID(id, 4)) {
            throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
        };
        
        const product = await this.ProductsService.getProductsById(id);
        if (!product) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
          };
          return product;
    };

    @Post('addProduct')
    @HttpCode(HttpStatus.CREATED)
    async addProduct(@Body() createProductDto: CreateProductDto) {
        return await this.ProductsService.addProduct(createProductDto)
    };

    @Put(':id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async updateProduct(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateProductDto: UpdateProductDto) {
        if (!isUUID(id, 4)) {
            throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
        };
        const updatedUser = await this.ProductsService.updateProduct(id, updateProductDto)
        return updatedUser.id;
    };

    @Delete(':id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async deleteProduct(@Param('id', new ParseUUIDPipe()) id: string) {
        if (!isUUID(id, 4)) {
            throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
        };
        return await this.ProductsService.deleteProduct(id);
    };
};