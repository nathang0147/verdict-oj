import {Inject, Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import Redis, { Redis as RedisClientType } from "ioredis";
import {timeout} from "rxjs";
import {ConfigService} from "@nestjs/config";
import {ReceiverService} from "@modules/receiver/receiver.service";

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
    private redisSubscriber: RedisClientType;  // Redis connection pool instance

    constructor(
        private configService: ConfigService,
        private readonly receiverService: ReceiverService,
    ) {}

    async onModuleInit() {
        // Check if Redis is already connected or in the process of connecting
        if (!this.redisSubscriber || this.redisSubscriber.status !== 'ready') {
            this.redisSubscriber = new Redis({
                port: this.configService.get<number>('REDIS_PORT'),
                host: this.configService.get<string>('AZURE_CACHE_FOR_REDIS_HOST_NAME'),
                password: this.configService.get<string>('KEY_ACCESS'),
                db: 0, // Target specific Redis database
                maxRetriesPerRequest: 5,
            });

            this.redisSubscriber.on('error', (err) => console.error('Redis Subscriber Error', err));

            // Only call connect if Redis is not already connected/connecting
            if (!this.redisSubscriber || this.redisSubscriber.status !== 'ready') {
                console.log('Redis subscriber already connecting/connected');
            } else {
                await this.redisSubscriber.connect(); // Connect Redis on demand
            }
        }

        // Subscribe to the 'verdict' channel for receiving messages
        await this.redisSubscriber.subscribe('verdict', (err, count) => {
            if (err) {
                console.error('Failed to subscribe: ', err.message);
            } else {
                console.log(`Subscribed to ${count} channel(s). Waiting for messages...`);
            }
        });

        // Listen for messages on the 'verdict' channel
        this.redisSubscriber.on('message', (channel, message) => {
            console.log(`Received message from ${channel}: ${message}`);
            this.handleReceivedMessage(message);
        });
    }


    // Handle received message from the subscriber
    private handleReceivedMessage(message: string) {
        const parsedMessage = JSON.parse(message);
        // Process the received message
        console.log('Processing received message: ', parsedMessage);

        const submissionId = parseInt(parsedMessage.payload.id);
        if (isNaN(submissionId)) {
            console.error('Invalid submission ID:', parsedMessage.payload.id);
            return;
        }

        this.receiverService.handleMessage(submissionId).then(r => {
            console.log('Message processed successfully: ', r);
        });
    }

    async onModuleDestroy() {
        await this.redisSubscriber.quit();  // Gracefully close the pool
    }
}
