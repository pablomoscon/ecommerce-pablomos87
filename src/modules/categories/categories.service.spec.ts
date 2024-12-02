import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  const mockRepository = {
    find: async () => [],
    findOneBy: async (category: CreateCategoryDto) => {
      if (category.name === 'Existing Category') {
        const category = new Category();
        category.name = 'Existing Category';
        return category;
      }
      return null;
    },
    create: (categoryDto: CreateCategoryDto) => {
      const category = new Category();
      category.name = categoryDto.name;
      return category;
    },
    save: async (category: Category) => {
      return category;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findAllCategories and return an empty array', async () => {
    const result = await service.findAllCategories();
    expect(result).toEqual([]);
  });

  it('should call addCategories and create categories if they do not exist', async () => {
    const categoryDto: CreateCategoryDto = { name: 'New Category' };
    const categories: CreateCategoryDto[] = [categoryDto];

    await service.addCategories(categories);

    const createdCategory = mockRepository.create(categoryDto);
    await mockRepository.save(createdCategory);

    expect(createdCategory.name).toBe(categoryDto.name);
  });

  it('should not create a category if it already exists', async () => {
    const categoryDto: CreateCategoryDto = { name: 'Existing Category' };

    const existingCategory = await mockRepository.findOneBy({ name: categoryDto.name });
    expect(existingCategory).toBeInstanceOf(Category); 

    await service.addCategories([categoryDto]);

    const createdCategory = mockRepository.create(categoryDto);
    expect(createdCategory).toEqual(existingCategory);
  });

  it('should create multiple categories if they do not exist', async () => {
    const categoryDtos: CreateCategoryDto[] = [
      { name: 'Category 1' },
      { name: 'Category 2' },
    ];

    await service.addCategories(categoryDtos);

    for (const categoryDto of categoryDtos) {
      const createdCategory = mockRepository.create(categoryDto);
      await mockRepository.save(createdCategory);
      expect(createdCategory.name).toBe(categoryDto.name);
    }
  });
});