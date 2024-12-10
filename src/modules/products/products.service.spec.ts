import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

let products = [
  { id: 'abcd1234', name: 'Product 1', price: 100, stock: 10 },
  { id: 'abcd1235', name: 'Product 2', price: 200, stock: 0 },
];

const mockProductsRepository = {
  find: ({ skip, take }: { skip: number; take: number }) => {
    return Promise.resolve(products.slice(skip, skip + take));
  },
  findOneBy: ({ id }: { id: string }) => {
    const product = products.find((p) => p.id === id);
    return Promise.resolve(product);
  },
  create: (createProductDto: CreateProductDto) => ({
    ...createProductDto,
    id: `abcd1236`,
  }),
  save: (product: Product) => {
    products.push(product);
    return Promise.resolve(product);
  },
  update: (id: string, updateProductDto: UpdateProductDto) => {
    const product = products.find((p) => p.id === id);
    if (!product) return Promise.resolve(null);

    const updatedProduct = { ...product, ...updateProductDto };
    products = products.map((p) => (p.id === id ? updatedProduct : p));
    return Promise.resolve(updatedProduct);
  },
  delete: (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) {
      return Promise.resolve({ deleted: false, id });
    }
    products = products.filter((p) => p.id !== id);
    return Promise.resolve({ deleted: true, id });
  },
};

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    products = [
      { id: 'abcd1234', name: 'Product 1', price: 100, stock: 10 },
      { id: 'abcd1235', name: 'Product 2', price: 200, stock: 0 },
    ];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the correct product based on the id', async () => {
    const productId = 'abcd1234';
    const product = await service.findProductsById(productId);
    expect(product).toBeDefined();
    expect(product?.id).toBe(productId);
  });

  it('should return undefined if the product does not exist', async () => {
    const productId = 'non-existing-id';
    const product = await service.findProductsById(productId);
    expect(product).toBeUndefined();
  });

  it('should create and return a product when valid data is provided', async () => {
    const CreateProductDto: CreateProductDto = {
      name: 'New Product',
      price: 150,
      stock: 20,
      description: 'A good product',
      imgUrl: 'www.product.com/image'
    };

    const mockProduct = {
      id: 'abcd1236',
      ...CreateProductDto,
    };

    mockProductsRepository.create(CreateProductDto);
    const result = await service.addProduct(CreateProductDto);

    expect(result).toEqual(mockProduct);
  });

  it('should update and return the product when valid data is provided', async () => {
    const productId = 'abcd1234';
    const updateProductDto: UpdateProductDto = {
      name: 'Updated Product 1',
      price: 120,
    };

    const updatedProduct = {
      id: productId,
      ...updateProductDto,
      stock: 10
    };

    const result = await service.updateProduct(productId, updateProductDto);

    expect(result).toEqual(updatedProduct);
  });

  it('should delete a product and return the correct response', async () => {
    const productId = 'abcd1234';
    const initialProductsLength = products.length;

    const result = await service.deleteProduct(productId);

    expect(result).toEqual({ deleted: true, id: productId });
    expect(products.length).toBe(initialProductsLength - 1);
    expect(products.find((p) => p.id === productId)).toBeUndefined();
  });

  it('should return deleted: false when trying to delete a non-existing product', async () => {
    const nonExistingId = 'non-existing-id';
    const initialProductsLength = products.length;

    const result = await service.deleteProduct(nonExistingId);

    expect(result).toEqual({ deleted: false, id: nonExistingId });
    expect(products.length).toBe(initialProductsLength);
  });

  it('should throw an error when trying to buy a product out of stock', async () => {
    const productId = 'abcd1235';
    try {
      await service.buyProduct(productId);
    } catch (error: any) {
      expect(error.message).toBe('Out of stock');
    }
  });

  it('should buy a product and decrease the stock', async () => {
    const productId = 'abcd1234';
    const product = products.find((p) => p.id === productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const initialStock = product.stock;
    const result = await service.buyProduct(productId);

    expect(result).toBe(product.price);
    expect(products.find((p) => p.id === productId)?.stock).toBe(initialStock - 1);
  });
});