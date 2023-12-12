import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const conifg = new DocumentBuilder().setTitle("PeeP").setDescription('Api for PEEP').setVersion('1.0').build()

  const document = SwaggerModule.createDocument(app, conifg)
  SwaggerModule.setup('api', app, document)

  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}
bootstrap();
