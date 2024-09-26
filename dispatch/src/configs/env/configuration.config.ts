import * as process from 'node:process';

export interface DatabaseConfig {
	host: string;
	port: number;
	username: string;
	password: string;
	name: string;
	timezone: string;
	typeormSync: boolean;
}

export interface RedisConfig {
	host: string,
	port: number,
	username?: string,
	password?: string,
}

export const NodeEnv = {
	Dev: 'development',
	Prod: 'production',
	Test: 'test',
	Provision: 'provision',
	Staging: 'staging',
};

export interface EnvironmentVariables {
	NODE_ENV: string;
	redis: RedisConfig;
	database: DatabaseConfig;
}

export default ():  EnvironmentVariables => {
	return {
		NODE_ENV: process.env.NODE_ENV || 'development',
		redis:{
			host: process.env.AZURE_CACHE_FOR_REDIS_HOST_NAME,
			port: parseInt(process.env.REDIS_PORT),
			username: process.env.REDIS_SERVICE_PRINCIPAL_ID,
			password: process.env.KEY_ACCESS,
		},
		database: {
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT),
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			name: process.env.DB_NAME,
			timezone: process.env.DB_TIMEZONE || 'UTC',
			typeormSync: process.env.TYPEORM_SYNC === 'true' || false,
		},
	}
};
