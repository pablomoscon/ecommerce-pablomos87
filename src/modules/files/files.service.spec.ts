import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { CloudinaryService } from 'src/service/cloudinary/cloudinary.service';
import { ProductsService } from '../products/products.service';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { Product } from '../products/entities/product.entity';

describe('FilesService', () => {
  let service: FilesService;
  let mockCloudinaryService: Partial<CloudinaryService>;
  let mockProductsService: Partial<ProductsService>;

  beforeEach(async () => {
    mockCloudinaryService = {
      uploadFile: async (buffer: Buffer, filename: string) => {
        return 'http://cloudinary.com/test-image.jpg';
      },
      getUrl: async (publicId: string) => {
        return `http://cloudinary.com/${publicId}.jpg`;
      },
    };

    mockProductsService = {
      updateProduct: async (id: string, updateProductDto: UpdateProductDto) => {
        const updatedProduct = { 
          ...updateProductDto, 
          id: id,
        } as Product;
        return updatedProduct;
      },
    };

    mockProductsService.updateProduct = jest.fn(mockProductsService.updateProduct);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: CloudinaryService, useValue: mockCloudinaryService },
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload an image and update the product with the image URL', async () => {
    const file = {
      buffer: Buffer.from('test-file-data'),
      originalname: 'test-image.jpg',
    } as Express.Multer.File;

    const uploadedImageUrl = 'http://cloudinary.com/test-image.jpg';
    const productId = '1234abcd';

    const result = await service.uploadImage(productId, file);

    expect(mockProductsService.updateProduct).toHaveBeenCalledWith(productId, { imgUrl: uploadedImageUrl });
    expect(result).toBe(uploadedImageUrl);
  });

  it('should get the URL of an image from Cloudinary', async () => {
    const publicId = 'test-image-id';
    const imageUrl = 'http://cloudinary.com/test-image-id.jpg';

    const result = await service.getUrl(publicId);

    expect(result).toBe(imageUrl);
  });

  it('should handle errors in uploadImage', async () => {
    const file = {
      buffer: Buffer.from('test-file-data'),
      originalname: 'test-image.jpg',
    } as Express.Multer.File;
    const productId = '1234abcd';

    mockCloudinaryService.uploadFile = async () => { throw new Error('Cloudinary upload failed'); };

    await expect(service.uploadImage(productId, file)).rejects.toThrowError('Cloudinary upload failed');
  });
});