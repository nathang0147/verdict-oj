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

export enum NodeEnv {
	Dev = 'development',
	Prod = 'production',
}

export const databaseConfig = () => ({
	database: {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		timezone: process.env.DB_TIMEZONE,
		typeormSync: process.env.TYPEORM_SYNC,
	},
});
