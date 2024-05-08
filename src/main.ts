import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { EmojiLogger } from './utils/logger/LoggerService';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new EmojiLogger(),
  });
  //PIPE
  app.useGlobalPipes(new ValidationPipe());
  //
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Project')
    .setDescription('The projects API description')
    .setVersion('1.0')
    .addTag('project')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //version
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  await app.listen(parseInt(process.env.PORT, 10) || 3000);
}
bootstrap();
