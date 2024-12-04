import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  HttpStatus,
  Query,
  Param,
  Body,
  HttpCode,
  ParseUUIDPipe,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from '../users/enum/roles.enum';
import { ApiTags } from '@nestjs/swagger';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllProducts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    return await this.productsService.findProducts(pageNumber, limitNumber);
  };

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findProductsById(@Param('id', new ParseUUIDPipe()) id: string) {
    const product = await this.productsService.findProductsById(id);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  };

  @Post('add-product')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addProduct(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.productsService.addProduct(createProductDto);
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException('Product already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
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
      return { updateProductId: updatedProduct.id };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error updating product',
        HttpStatus.INTERNAL_SERVER_ERROR,
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
  };
};
