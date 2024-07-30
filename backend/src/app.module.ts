import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import * as process from 'node:process';
import configurationConfig, {DatabaseConfig, EnvironmentVariables, NodeEnv} from './configs/configuration.config';
import Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';

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
			load: [configurationConfig],
			isGlobal: true,
			envFilePath:
				process.env.NODE_ENV?.trim() === NodeEnv.Dev ? '.env.dev' : '.env',
			cache: true,
			expandVariables: true,
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService<EnvironmentVariables>) => {
				const databaseConfig = configService.get<DatabaseConfig>('database');

				return {
					type: 'postgres',
					host: databaseConfig?.host,
					port: databaseConfig?.port,
					username: databaseConfig?.username,
					password: databaseConfig?.password,
					database: databaseConfig?.name,
					useUTC: databaseConfig?.timezone === 'UTC',
					autoLoadEntities: Boolean(databaseConfig?.typeormSync),
					synchronize: Boolean(databaseConfig?.typeormSync),
				}
			}
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
