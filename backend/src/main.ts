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
	logger.debug(redis_env);

	await app.listen(3000, () => {
		logger.log(
			`Server is running on http://localhost:${configService.get('PORT')}`,
		);
	});
}
bootstrap();
