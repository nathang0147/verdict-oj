import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import * as process from 'node:process';
import configurationConfig, {
	DatabaseConfig,
	EnvironmentVariables,
	NodeEnv,
	RedisConfig
} from '@configs/env/configuration.config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UserModule} from "@modules/user/user.module";
import {ProblemModule} from "@modules/problem/problem.module";
import {TestcaseModule} from "@modules/testcase/testcase.module";
import {SubmissionModule} from "@modules/submission/submission.module";
import {UserRolesModule} from "@modules/user-roles/user-roles.module";
import {AuthenticationModule} from "@modules/authentication/authentication.module";
import {AuthorizationModule} from "@modules/authorization/authorization.module";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {ScheduleModule} from "@nestjs/schedule";
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "@modules/authentication/guard/jwt-auth.guard";
import {RoleGuard} from "@modules/authorization/guard/role.guard";
import {ProblemTagModule} from "@modules/problem-tag/problem-tag.module";
import {CacheModule} from "@nestjs/cache-manager";
import {RedisClientOptions} from "redis";
import {redisStore} from "cache-manager-redis-yet";

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
					autoLoadEntities: true,
					synchronize: Boolean(databaseConfig?.typeormSync),
				}
			},
		}),
		CacheModule.registerAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService<EnvironmentVariables>) => {
				const redisConfig = configService.get<RedisConfig>('redis');
				return {
					store: redisStore,
					password: redisConfig.password,
					socket:{
						host: redisConfig.host,
						port: redisConfig.port||6379,
					},
					ttl: 18000,//milliseconds
					database: 15,
				}
			},
			isGlobal: true,
		}),
		UserModule,
		UserRolesModule,
		ProblemModule,
		ProblemTagModule,
		TestcaseModule,
		SubmissionModule,
		AuthenticationModule,
		AuthorizationModule,
		ThrottlerModule.forRoot([
			{
				name: 'short',
				ttl: 1000,
				limit: 50,
			},
			{
				name: 'long',
				ttl: 60000,
				limit: 1000,
			},
		]),
		ScheduleModule.forRoot(),
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard
		},
		{
			provide: APP_GUARD,
			useClass: RoleGuard
		},
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
