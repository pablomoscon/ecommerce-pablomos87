import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';


@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Category) private categoriesRepository: Repository<Category>,
    ) { }

    async findAllCategories() {
        return this.categoriesRepository.find();
    };

    async addCategories(createCategoryDto: CreateCategoryDto[]) {
        for (const categoryDto of createCategoryDto) {
            const existingCategory = await this.categoriesRepository.findOneBy({ name: categoryDto.name });

            if (!existingCategory) {
                const newCategory = this.categoriesRepository.create(categoryDto);
                await this.categoriesRepository.save(newCategory);
            }
            return 'Categories processed successfully';
        }
        
    };
};