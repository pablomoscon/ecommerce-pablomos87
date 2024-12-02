import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { ProductsService } from 'src/modules/products/products.service';
import { Product } from 'src/modules/products/entities/product.entity';
import { UsersService } from 'src/modules/users/users.service';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';

describe('Products (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let productsService: ProductsService;
  let usersService: UsersService;

  function createMockProduct(overrides: Partial<Product> = {}): Product {
    return {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Product 1',
      price: 100,
      stock: 10,
      description: 'Default Description',
      imgUrl: 'http://example.com/default.jpg',
      category: [],
      orderDetails: null,
      ...overrides,
    };
  }

  beforeEach(async () => {
    process.env.ENVIRONMENT = 'TEST';

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ProductsService)
      .useValue({
        findProducts: jest.fn(),
        findProductsById: jest.fn(),
        addProduct: jest.fn(),
        updateProduct: jest.fn(),
        deleteProduct: jest.fn(),
      })
      .overrideProvider(UsersService)
      .useValue({
        findByEmail: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    productsService = moduleFixture.get<ProductsService>(ProductsService);

    usersService = moduleFixture.get<UsersService>(UsersService);

    const hashedPassword = await bcrypt.hash('123456', 10);

    jest.spyOn(usersService, 'findByEmail').mockImplementation(async (email) => {
      if (email === 'johndou@email.com') {
        return Promise.resolve({
          id: '123',
          name: 'John Doe',
          email: 'johndou@email.com',
          password: hashedPassword,
          role: 'admin',
        });
      }
      return Promise.resolve(undefined);
    });

    const loginResponse = await request(app.getHttpServer())
    .post('/auth/signin')
    .send({
      email: 'johndou@email.com',
      password: '123456',
    });
    
  authToken = loginResponse.body['token'];

  });

  afterEach(async () => {
    await app.close();
  });

  it('/products (GET) should return an array of products with OK status code', async () => {
    const mockProducts = [
      createMockProduct({ id: '123e4567-e89b-12d3-a456-426614174000', name: 'Product 1' }),
      createMockProduct({ id: '123e4567-e89b-12d3-a456-426614174020', name: 'Product 2', price: 200, stock: 5 }),
    ];

    jest.spyOn(productsService, 'findProducts').mockResolvedValue(mockProducts);

    const req = await request(app.getHttpServer())
    .get('/products')

    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array);
    expect(req.body.length).toBe(2);
    expect(req.body[0].name).toBe('Product 1');
  });

  it('/products/:id (GET) should return a product by ID', async () => {
    
    const mockProduct = createMockProduct({ id: '123e4567-e89b-12d3-a456-426614174000' });

    jest.spyOn(productsService, 'findProductsById').mockResolvedValue(mockProduct);

    const req = await request(app.getHttpServer())
    .get('/products/123e4567-e89b-12d3-a456-426614174000');

    expect(req.status).toBe(200);
    expect(req.body.name).toBe('Product 1');
  });

  it('/products (POST) should add a new product and return it', async () => {
    const createProductDto = {
      name: 'Product 3',
      price: 300,
      stock: 15,
      description: 'Description of Product 3',
      imgUrl: 'http://example.com/product3.jpg',
    };

    const mockProduct = createMockProduct({ id: '123e4567-e89b-12d3-a456-426614174000', ...createProductDto });

    jest.spyOn(productsService, 'addProduct').mockResolvedValue(mockProduct);

    const req = await request(app.getHttpServer())
      .post('/products/add-product')
      .set('Authorization', `Bearer ${authToken}`)
      .send(createProductDto);

    expect(req.status).toBe(201);
    expect(req.body.name).toBe('Product 3');
    expect(req.body.price).toBe(300);
  });

  it('/products/:id (PUT) should update a product', async () => {
    const updateProductDto = { name: 'Updated Product', price: 150 };
  
    const mockProduct = createMockProduct({
      id: '123e4567-e89b-12d3-a456-426614174000'
    });
  
    jest.spyOn(productsService, 'updateProduct').mockResolvedValue(mockProduct);
  
    const req = await request(app.getHttpServer())
      .put('/products/123e4567-e89b-12d3-a456-426614174000')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateProductDto);

    expect(req.status).toBe(200);
    expect(req.body.updateProductId).toBe(mockProduct.id);
  });

  it('/products/:id (DELETE) should delete a product', async () => {
    const mockDeleteResult = {
      raw: [],
      affected: 1,  
    };
  
    jest.spyOn(productsService, 'deleteProduct').mockResolvedValue(mockDeleteResult);
  
    const req = await request(app.getHttpServer())
      .delete('/products/123e4567-e89b-12d3-a456-426614174000')  
      .set('Authorization', `Bearer ${authToken}`);
  
    expect(req.status).toBe(200);
    expect(req.body.affected).toBe(1);
  });

  it('/products/:id (GET) should return 404 when product is not found', async () => {
    jest.spyOn(productsService, 'findProductsById').mockResolvedValue(null);

    const req = await request(app.getHttpServer())
      .get('/products/123e4567-e89b-12d3-a456-426614174000')
      .set('Authorization', `Bearer ${authToken}`);

    expect(req.status).toBe(404);
  });
});