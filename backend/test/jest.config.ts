import type { Config } from '@jest/types';
import * as path from 'path';

const config: Config.InitialOptions = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: path.resolve(__dirname, '../src'),
    testEnvironment: 'node',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
        '**/*.(t|j)s',
    ],
    coverageDirectory: path.resolve(__dirname, '../coverage'),
    moduleNameMapper: {
        '^@modules/(.*)$': path.resolve(__dirname, '../src/modules/$1'),
        '^@configs/(.*)$': path.resolve(__dirname, '../src/configs/$1'),
        '^@repositories/(.*)$': path.resolve(__dirname, '../src/repositories/$1'),
    },
};

export default config;