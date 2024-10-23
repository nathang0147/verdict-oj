import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import {Logger, ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());


  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  await app.listen(PORT, () => {
    logger.log(
        `Server is running on http://localhost:${configService.get('PORT')}`,
    );
  });
}
bootstrap();
