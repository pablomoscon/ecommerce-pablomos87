import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';



describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    findProducts: async (page: number, limit: number) => {
      return [
        { id: '1', name: 'Product 1', description: 'Description 1' },
        { id: '2', name: 'Product 2', description: 'Description 2' },
      ];
    },
    findProductsById: async (id: string) => {
      if (id === '1') {
        return { id: '1', name: 'Product 1', description: 'Description 1' };
      }
      return null;
    },
    addProduct: async (createProductDto: CreateProductDto) => {
      if (createProductDto.name === 'Existing Product') {
        throw { code: '23505' }; // Simulando un conflicto de producto ya existente
      }
      return { id: '3', name: createProductDto.name, description: createProductDto.description };
    },
    updateProduct: async (id: string, updateProductDto: UpdateProductDto) => {
      return { id, ...updateProductDto };
    },
    deleteProduct: async (id: string) => {
      if (id === '1') {
        return { id: '1', name: 'Product 1', description: 'Description 1' };
      }
      throw new HttpException('Error deleting product', HttpStatus.INTERNAL_SERVER_ERROR);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();
  
    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return a list of products', async () => {
      const result = await controller.getAllProducts('1', '5');
      expect(result).toEqual([
        { id: '1', name: 'Product 1', description: 'Description 1' },
        { id: '2', name: 'Product 2', description: 'Description 2' },
      ]);
    });
  });

  describe('findProductsById', () => {
    it('should return a product by ID', async () => {
      const result = await controller.findProductsById('1');
      expect(result).toEqual({ id: '1', name: 'Product 1', description: 'Description 1' });
    });

    it('should throw an error if product is not found', async () => {
      await expect(controller.findProductsById('3')).rejects.toThrowError(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('addProduct', () => {
    it('should add a product successfully', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        description: 'New product description',
        price: 100,       
        stock: 10,        
        imgUrl: 'http://example.com/product-image.jpg',
      };
    
      const result = await controller.addProduct(createProductDto);
      expect(result).toEqual({ id: '3', name: 'New Product', description: 'New product description' });
    });

    it('should throw an error if product already exists', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Existing Product',
        description: 'Existing Product description',
        price: 100,      
        stock: 10,       
        imgUrl: 'http://example.com/product-image.jpg',
      };
    
      await expect(controller.addProduct(createProductDto)).rejects.toThrowError(
        new HttpException('Product already exists', HttpStatus.CONFLICT),
      );
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        description: 'Updated product description',
      };
      const result = await controller.updateProduct('1', updateProductDto);
      expect(result).toEqual({ updateProductId: '1' });
    });

    it('should throw an error if update fails', async () => {
      const updateProductDto: UpdateProductDto = {
          name: 'Updated Product',
          description: 'Updated product description',
      };
  
      mockProductsService.updateProduct = async () => {
          throw new Error('Simulated failure in service');
      };
  
      await expect(controller.updateProduct('non-existent-id', updateProductDto))
          .rejects
          .toThrowError(new HttpException('Error updating product', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      const result = await controller.deleteProduct('1');
      expect(result).toEqual({ id: '1', name: 'Product 1', description: 'Description 1' });
    });

    it('should throw an error if deletion fails', async () => {
      await expect(controller.deleteProduct('non-existent-id')).rejects.toThrowError(
        new HttpException('Error deleting product', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});