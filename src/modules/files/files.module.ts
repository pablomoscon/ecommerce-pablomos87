import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { Product } from '../products/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/service/cloudinary/cloudinary.service';
import { ProductsService } from '../products/products.service';
import { CloudinaryConfig } from 'src/config/cloudinary.config';

@Module({
  imports:  [TypeOrmModule.forFeature([ Product])],
  controllers: [FilesController],
  providers: [FilesService, CloudinaryService, ProductsService, CloudinaryConfig],
})
export class FilesModule {}