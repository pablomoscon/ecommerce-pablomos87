import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "src/modules/categories/entities/category.entity";
import { Product } from "src/modules/products/entities/product.entity";
import { CategoriesSeed } from "./categories/categories.seed";
import { ProductsSeed } from "./products/products.seed";


@Module({
    imports: [TypeOrmModule.forFeature([Category, Product])],
    providers: [CategoriesSeed, ProductsSeed],
    exports: [CategoriesSeed, ProductsSeed],
  })
  export class SeedsModule {}



