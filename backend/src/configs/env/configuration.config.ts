import * as process from 'node:process';
import {accessTokenPrivateKey, accessTokenPublicKey} from "../../contraints/jwt.contraints";

export interface DatabaseConfig {
	host: string;
	port: number;
	username: string;
	password: string;
	name: string;
	timezone: string;
	typeormSync: boolean;
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
	jwtSecret: string;
	jwtPrivateKey: string;
	accessTokenExpiredTime: number;
	refreshTokenExpiredTime: number;
	database: DatabaseConfig;
}

export default (): EnvironmentVariables => {
	return {
		NODE_ENV: process.env.NODE_ENV || 'development',
		jwtSecret: accessTokenPublicKey,
		jwtPrivateKey: accessTokenPrivateKey,
		accessTokenExpiredTime: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME),
		refreshTokenExpiredTime: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME),
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
