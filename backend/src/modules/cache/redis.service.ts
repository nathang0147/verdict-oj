import {Inject, Injectable, OnModuleDestroy, OnModuleInit} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";
import {createClient, RedisClientType} from "redis";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class RedisService implements OnModuleInit,OnModuleDestroy{
    private redisClient: RedisClientType;

    constructor(private configService: ConfigService) {
    }

    async onModuleInit() {
        this.redisClient = createClient({
            password: this.configService.get<string>('KEY_ACCESS'),
            socket:{
                host: this.configService.get<string>('AZURE_CACHE_FOR_REDIS_HOST_NAME'),
                port: this.configService.get<number>('REDIS_PORT'),
                reconnectStrategy: (retries: number) => {
                    if (retries > 10) {
                        return new Error('Retry limit reached');
                    }
                    return Math.min(retries * 50, 2000); // Retry delay
                },
            }
        })

        this.redisClient.on('error', (err) => console.error('Redis Client Error', err));
        await this.redisClient.connect();
    }

    async onModuleDestroy() {
        await this.redisClient.disconnect();
    }


    async getBit(key: string, offset: number) {
        return this.redisClient.getBit(key, offset);
    }

    async bitCount(key: string) {
        return this.redisClient.bitCount(key);
    }

    async setBit(key: string, offset: number, value: 0|1) {
        return this.redisClient.setBit(key, offset, value);
    }

}