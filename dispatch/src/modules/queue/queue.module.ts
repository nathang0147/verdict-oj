import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import {ReceiverModule} from "@modules/receiver/receiver.module";

@Module({
  imports: [ReceiverModule],
  controllers: [],
  providers: [QueueService],
  exports: [QueueService]
})
export class QueueModule {}
