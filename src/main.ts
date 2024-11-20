import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AllExceptionFilter } from './common/filter/exception.filter';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggerService } from './common/logger/logger.service';
import { Environment } from './config/environment-config/environment-config.validation';

async function bootstrap() {
  const env = process.env.NODE_ENV;
  const port = process.env.APP_PORT;
  const app = await NestFactory.create(AppModule);

  //CORS
  app.enableCors({
    origin: '*',
  });

  // Filter
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  // pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // interceptors
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));

  // base routing
  app.setGlobalPrefix('api/v1');

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // swagger config
  if (env === Environment.Development) {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('FXQL Parser')
      .setDescription(
        'Foreign Exchange Query Language (FXQL) Statement Parser Implementation',
      )
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    });
    SwaggerModule.setup('swagger-ui', app, document, {
      customSiteTitle: 'FXQL Parser API DOCS',
    });
  }

  await app
    .listen(port)
    .then(() => console.log(`Application is running on port: ${port}`));
}
bootstrap();
