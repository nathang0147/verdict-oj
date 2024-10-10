import {Inject, Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import Redis, { Redis as RedisClientType } from "ioredis";
import {timeout} from "rxjs";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
    private redisPool: RedisClientType;  // Redis connection pool instance

    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        this.redisPool = new Redis({
            port: this.configService.get<number>('REDIS_PORT'),
            host: this.configService.get<string>('AZURE_CACHE_FOR_REDIS_HOST_NAME'),
            password: this.configService.get<string>('KEY_ACCESS'),
            db: 0, // Target specific Redis database
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

        this.redisPool.on('error', (err) => console.error('Redis Client Error', err));
        this.redisPool.on('close', () => {
            console.warn('Redis Pool Connection Closed');
            // Optional: Add reconnect logic here if needed
        });
        if (this.redisPool.status !== 'ready') {
            await this.redisPool.connect();
        }
    }

    public async send(payload: any) {
        const message = JSON.stringify({
            payload,
            options: {
                persistent: true,
                contentType: 'application/json',
            },
        });

        // Send the message using Redis Pub/Sub or another messaging mechanism
        return  this.redisPool.publish('verdict', message)
    }

    async onModuleDestroy() {
        await this.redisPool.quit();  // Gracefully close the pool
    }
}
