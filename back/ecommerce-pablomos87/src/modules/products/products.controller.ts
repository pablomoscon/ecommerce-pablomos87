import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  HttpStatus,
  Query,
  Res,
  Param,
  Body,
  HttpCode,
  ParseUUIDPipe,
  HttpException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { isUUID } from 'class-validator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllProducts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    return await this.productsService.getProducts(pageNumber, limitNumber);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProductsById(@Param('id', new ParseUUIDPipe()) id: string) {
    const product = await this.productsService.getProductsById(id);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  };

  @Post('addProduct')
  @HttpCode(HttpStatus.CREATED)
  async addProduct(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.productsService.addProduct(createProductDto);
    } catch (error) {
      throw new HttpException(
        'Error adding product',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  @Put(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
      try {
        const updatedProduct = await this.productsService.updateProduct(
          id,
          updateProductDto,
        );
        return updatedProduct.id;
      } catch (error) {
        throw new HttpException(
          'Error updating product',
          error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    };

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.productsService.deleteProduct(id);
    } catch (error) {
      throw new HttpException(
        'Error deleting product',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
};
