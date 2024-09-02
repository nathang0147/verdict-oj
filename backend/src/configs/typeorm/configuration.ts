import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import * as process from 'node:process';
import { registerAs } from '@nestjs/config';

dotenvConfig({ path: '.env.dev' });

const isDevEnv = process.env.NODE_ENV === 'development';

const config = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [isDevEnv ? 'src/**/entities/*.ts' : 'dist/**/entities/*.js'],
    migrations: [isDevEnv ? 'src/migrations/*.ts' : 'dist/migrations/*.js'],
    timezone: process.env.DB_TIMEZONE || 'UTC',
    synchronize: process.env.TYPEORM_SYNC === 'true' || false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);