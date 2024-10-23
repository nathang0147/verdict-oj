import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger, ValidationPipe} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {DatabaseConfig, RedisConfig} from '@configs/env/configuration.config';

async function bootstrap() {
	const logger = new Logger(bootstrap.name);
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe());


	const configService = app.get(ConfigService);
	const redis_env = configService.get<RedisConfig>('redis');
	const port = configService.get('PORT') || 3000;

	await app.listen(port, () => {
		logger.log(
			`Server is running on http://verdict-oj-backend.azurewebsites.net:${port}`,
		);
	});
}
bootstrap();
