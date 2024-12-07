import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { ApiTags } from '@nestjs/swagger';


@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }


  @Get()
  async getAlCategories() {
    try {
      return await this.categoriesService.findAllCategories()
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get categories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  @Post('add-categories')
  async addCategories(@Body() createCategoryDto: CreateCategoryDto[]) {
    try {
      await this.categoriesService.addCategories(createCategoryDto);
      return { message: 'Categories added successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to add categories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };
};

