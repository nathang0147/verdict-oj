import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';

@Module({
  imports: [],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService]
})
export class QueueModule {}
