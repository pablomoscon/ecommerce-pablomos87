import { Inject, Injectable } from '@nestjs/common';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') private cloudinaryInstance: typeof cloudinary
  ) { };

  async uploadFile(buffer: Buffer, originalname?: string): Promise<string> {
    const options: UploadApiOptions = {
      folder: 'uploads',
      public_id: originalname,
      resource_type: 'auto',
    };

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          error ? reject(error) : resolve(result.secure_url);
        });
      stream.write(buffer);
      stream.end();
    });
  };

  async getUrl(publicId: string): Promise<string> {
    const result = await cloudinary.api.resource(publicId);
    return result.secure_url;
  }
};
