import { Module } from '@nestjs/common';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import {ConfigService} from "@nestjs/config";
import {EnvironmentVariables, RedisConfig} from "@configs/env/configuration.config";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'REDIS_SERVICE',
        useFactory: async (configService: ConfigService<EnvironmentVariables>) => {
          const queueConfig = configService.get<RedisConfig>('redis');
          return {
            transport: Transport.REDIS,
            options:{
              password: queueConfig.password,
              socket:{
                host: queueConfig.host,
                port: queueConfig.port||6379,
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
})
export class QueueModule {}
