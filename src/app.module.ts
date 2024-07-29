import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import { databaseConfig } from './configs/configuration.config';
import Joi from 'joi';

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'production', 'test', 'provision', 'staging')
					.default('development'),
				PORT: Joi.number().default(3000),
			}),
			validationOptions: {
				abortEarly: false,
			},
			load: [databaseConfig],
			isGlobal: true,
			envFilePath:
				process.env.NODE_ENV?.trim() === 'development' ? '.env.dev' : '.env',
			cache: true,
			expandVariables: true,
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
