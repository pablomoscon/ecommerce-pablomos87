import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;


  const mockCategoriesService = {
    findAllCategories: async () => {

      return [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ];
    },
    addCategories: async (createCategoryDtos: CreateCategoryDto[]) => {

      if (createCategoryDtos.some((dto) => !dto.name)) {
        throw new Error('Invalid category');
      }
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAlCategories', () => {
    it('should return a list of categories', async () => {
      const result = await controller.getAlCategories();
      expect(result).toEqual([
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ]);
    });
  });

  describe('addCategories', () => {
    it('should add categories successfully', async () => {
      const categoriesDto: CreateCategoryDto[] = [
        { name: 'New Category 1' },
        { name: 'New Category 2' },
      ];

      const result = await controller.addCategories(categoriesDto);
      expect(result).toEqual({ message: 'Categories added successfully' });
    });

    it('should throw an error if a category is invalid', async () => {
      const invalidCategoriesDto: CreateCategoryDto[] = [
        { name: 'Valid Category' },
        { name: '' },
      ];

      await expect(controller.addCategories(invalidCategoriesDto)).rejects.toThrow(
        'Invalid category',
      );
    });
  });
});