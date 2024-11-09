import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGloblal } from './middleweres/logger.middlewere';
import { ValidationPipe } from '@nestjs/common';
import { CategoriesSeed } from './seeds/categories/categories.seed';
import { ProductsSeed } from './seeds/products/products.seed';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(loggerGloblal);
  const categoriesSeed = app.get(CategoriesSeed);
  await categoriesSeed.seed();
  console.log('La inserción de categorías ha terminado');
  
  const productsSeed = app.get(ProductsSeed);
  await productsSeed.seed();
  console.log('La inserción de productos ha terminado');
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
