import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { CloudinaryConfig } from '../../config/cloudinary';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:  [TypeOrmModule.forFeature([ Product])],
  controllers: [FilesController],
  providers: [FilesService, CloudinaryConfig, ProductsService],
})
export class FilesModule {}