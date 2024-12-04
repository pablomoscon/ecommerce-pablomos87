import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "src/modules/categories/entities/category.entity";
import { Product } from "src/modules/products/entities/product.entity";
import { CategoriesSeed } from "./categories/categories.seed";
import { ProductsSeed } from "./products/products.seed";
import { User } from "src/modules/users/entities/user.entity";
import { AdminUsersSeed } from "./admin-user/admin-user-seed";


@Module({
  imports: [TypeOrmModule.forFeature([Category, Product, User])],
  providers: [CategoriesSeed, ProductsSeed, AdminUsersSeed],
  exports: [CategoriesSeed, ProductsSeed, AdminUsersSeed],
})
export class SeedsModule { }



