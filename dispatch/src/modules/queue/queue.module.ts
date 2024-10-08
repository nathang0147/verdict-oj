import { Module } from '@nestjs/common';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import {ConfigService} from "@nestjs/config";
import {EnvironmentVariables, RedisConfig} from "../../configs/env/configuration.config";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'REDIS_QUEUE_CLIENT',
        useFactory: async (configService: ConfigService<EnvironmentVariables>) => {
          const queueConfig = configService.get<RedisConfig>('redis');
          return {
            transport: Transport.REDIS,
            options:{
              password: queueConfig.password,
              socket:{
                host: queueConfig.host,
                port: queueConfig.port||6379,
                reconnectStrategy: (retries: number) => {
                  if (retries > 10) {
                    return new Error('Retry limit reached');
                  }
                  return Math.min(retries * 50, 2000); // Retry delay
                },
              },
              database: 0
            }
          }
        },
        inject: [ConfigService]
      }
    ])
  ],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService]
})
export class QueueModule {}
