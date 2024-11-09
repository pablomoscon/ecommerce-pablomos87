import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import { ProductsService } from '../products/products.service';

@Injectable()
export class FilesService {
  constructor (

    private readonly productsService: ProductsService,
  ){ }
  
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    console.log(file); 
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async updateProductWithImageUrl(id: string, uploadResult: string): Promise<void> {
    const imgUrl = uploadResult;
    await this.productsService.updateProduct(id, {imgUrl} ); 
  }
}