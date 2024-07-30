import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './configs/configuration.config';

async function bootstrap() {
	const logger = new Logger(bootstrap.name);
	const app = await NestFactory.create(AppModule);



	const configService = app.get(ConfigService);
	const database_env = configService.get<DatabaseConfig>('database');
	logger.debug(database_env);

	await app.listen(3000, () => {
		logger.log(
			`Server is running on http://localhost:${configService.get('PORT')}`,
		);
	});
}
bootstrap();
