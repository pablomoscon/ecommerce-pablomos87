import { Injectable } from "@nestjs/common";
import { ProductsService } from '../products/products.service';
import { CloudinaryService } from "src/service/cloudinary/cloudinary.service";

@Injectable()
export class FilesService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly productsService: ProductsService,
  ) { }

  async uploadImage(id: string, file: Express.Multer.File) {

    const uploadedImageUrl = await this.cloudinaryService.uploadFile(file.buffer, file.originalname);
    await this.updateProductWithImageUrl(id, uploadedImageUrl);
    return uploadedImageUrl;
  };

  async getUrl(publicId: string) {
    return await this.cloudinaryService.getUrl(publicId);
  };

  async updateProductWithImageUrl(id: string, uploadedImageUrl: string): Promise<void> {
    const imgUrl = uploadedImageUrl;
    await this.productsService.updateProduct(id, { imgUrl });
  }
};