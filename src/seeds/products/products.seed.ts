import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/modules/categories/entities/category.entity";
import { Product } from "src/modules/products/entities/product.entity";
import { Repository } from "typeorm";
import { productsMock } from "./products-mock.seed";

@Injectable()
export class ProductsSeed {
  constructor(
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category) private readonly categoriesRepository: Repository<Category>,
  ) { }

  async findCategoryByName(category: string) {
    const foundCategory = await this.categoriesRepository.findOne({
      where: { name: category },
    });

    if (!foundCategory) {
      throw new Error(`Category ${category} not found`);
    }

    return foundCategory;
  }
  async seed() {

    const existingProductNames = (await this.productsRepository.find()).map(
      (product) => product.name,
    );

    for (const productData of productsMock) {
      if (!existingProductNames.includes(productData.name)) {
        const product = new Product();
        product.name = productData.name;
        product.description = productData.description;
        product.price = productData.price;
        product.stock
          = productData.stock;
        product.category
          = await this.findCategoryByName(productData.category);

        await this.productsRepository.save(product);
      }
    }
  }
}