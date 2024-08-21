import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import * as process from 'node:process';
import configurationConfig, {DatabaseConfig, EnvironmentVariables, NodeEnv} from '@configs/env/configuration.config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'production', 'test', 'provision', 'staging')
					.default('development'),
				PORT: Joi.number().default(3000),
				DB_HOST: Joi.string().required(),
				DB_PORT: Joi.number().required(),
				DB_USERNAME: Joi.string().required(),
				DB_PASSWORD: Joi.string().required(),
				DB_NAME: Joi.string().required(),
				DB_TIMEZONE: Joi.string().default('UTC'),
				TYPEORM_SYNC: Joi.boolean().default(false),
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
	controllers: [],
	providers: [],
})
export class AppModule {}
