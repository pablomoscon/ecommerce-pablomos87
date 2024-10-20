import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGloblal } from './middleweres/logger.middlewere';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(loggerGloblal);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
