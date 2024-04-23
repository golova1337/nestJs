import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
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
  await app.listen(3000);
}
bootstrap();
