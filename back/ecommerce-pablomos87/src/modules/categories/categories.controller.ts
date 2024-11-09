import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';


@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }


  @Get()
  async getAlCategories() {
    return await this.categoriesService.getAllCategories()
  }

  @Post('add-categories')
  async addCategories(@Body() createCategoryDto: CreateCategoryDto[]) {
    await this.categoriesService.addCategories(createCategoryDto);
    return { message: 'Categories added successfully' };
  }
}

