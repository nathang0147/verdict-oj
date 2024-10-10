import {Inject, Injectable, OnModuleDestroy, OnModuleInit} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import Redis, {Redis as RedisClient} from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private redisClient: RedisClient;

    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        this.redisClient = new Redis({
            port: this.configService.get<number>('REDIS_PORT'),
            host: this.configService.get<string>('AZURE_CACHE_FOR_REDIS_HOST_NAME'),
            password: this.configService.get<string>('KEY_ACCESS'),
            db: 15, // Target specific Redis database
            maxRetriesPerRequest: 5,
            reconnectOnError: (err) => {
                const targetErrors = ['READONLY', 'ECONNREFUSED'];
                if (targetErrors.some(e => err.message.includes(e))) {
                    return true; // Reconnect on specific Redis errors
                }
                return false;
            },
            keepAlive: 5000, // Keep connections alive every 5 seconds
            lazyConnect: true, // Lazy connection initialization,
            enableAutoPipelining: true, // Automatically pipeline requests,
            connectTimeout: 5000, // Timeout if Redis is unresponsive
            retryStrategy: (times) => {
                if (times > 10) {
                    return null; // Stop retrying after 10 attempts
                }
                return Math.min(times * 50, 2000); // Retry delay
            },
        });

        this.redisClient.on('error', (err) => console.error('Redis Client Error', err));
        this.redisClient.on('close', () => {
            console.warn('Redis Client Connection Closed');
        });
        if (this.redisClient.status !== 'ready') {
            await this.redisClient.connect();
        }
    }

    async onModuleDestroy() {
        await this.redisClient.quit();  // Gracefully close the connection
    }

    async getBit(key: string, offset: number) {
        return this.redisClient.getbit(key, offset);
    }

    async bitCount(key: string) {
        return this.redisClient.bitcount(key);
    }

    async setBit(key: string, offset: number, value: 0 | 1) {
        return this.redisClient.setbit(key, offset, value);
    }
}
