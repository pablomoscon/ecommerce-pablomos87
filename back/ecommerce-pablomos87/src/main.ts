import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGloblal } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { CategoriesSeed } from './seeds/categories/categories.seed';
import { ProductsSeed } from './seeds/products/products.seed';
import { AdminUsersSeed } from './seeds/admin-user/admin-user-seed';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSourceInstance } from './config/database.config';
import { MigrationExecutor } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await DataSourceInstance.initialize();

  const migrationExecutor = new MigrationExecutor(DataSourceInstance);
  const executedMigrations = await migrationExecutor.getExecutedMigrations();

  if (executedMigrations.length === 0) {
    await DataSourceInstance.runMigrations();
  }

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  app.use(loggerGloblal);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Demo Nest')
    .setDescription('Esta es una API construida con Nest para ser empleada en las demos del módulo 4 de la especialidad backend de la carrera Fullstack Developer')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const categoriesSeed = app.get(CategoriesSeed);
  await categoriesSeed.seed();
  console.log('The insertion of categories has been completed.');

  const productsSeed = app.get(ProductsSeed);
  await productsSeed.seed();
  console.log('The insertion of products has been completed.');

  const adminUserSeed = app.get(AdminUsersSeed);
  await adminUserSeed.seed();
  console.log('The insertion of administrator users has been completed.');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();