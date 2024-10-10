import { Module } from '@nestjs/common';
import { JSWorkerService } from './worker.service';
import { WorkerController } from './worker.controller';

@Module({
  controllers: [WorkerController],
  providers: [JSWorkerService],
  exports: [JSWorkerService],
})
export class WorkerModule {}
