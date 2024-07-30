import * as process from 'node:process';
import {defaults} from "joi";

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

export interface EnvironmentVariables {
	nodeEnv: NodeEnv;

	database: DatabaseConfig;
}

export default (): EnvironmentVariables => {
	return {
		nodeEnv: process.env.NODE_ENV === NodeEnv.Prod ? NodeEnv.Prod : NodeEnv.Dev,

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
