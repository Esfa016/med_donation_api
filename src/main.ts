import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {  ValidationPipe, VersioningType } from '@nestjs/common';
import * as paresr from 'body-parser';
import helmet from 'helmet';
import { AllExceptionsFilter } from './Global/sharables';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(helmet());
  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const port = process.env.PORT || 8080;
  app.use(paresr.json());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(port);
  
}
bootstrap();
