import {Inject, Injectable} from '@nestjs/common';
import Redis from "ioredis";
import {ClientProxy} from "@nestjs/microservices";
import {timeout} from "rxjs";

@Injectable()
export class QueueService {
    constructor(
        @Inject('REDIS_QUEUE_CLIENT') private readonly redisClient: ClientProxy
    ) {}

    public async send(payload: any){
        const message = JSON.stringify({
            payload,
            options: {
                persistent: true,
                contentType: 'application/json',
            },
        });
        const result = this.redisClient.send('verdict', message).pipe(timeout(1000));
        return result;
    }
}
