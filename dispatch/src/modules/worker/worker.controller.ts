import { Controller } from '@nestjs/common';
import { JSWorkerService } from './worker.service';

@Controller()
export class WorkerController {
  constructor(private readonly workerService: JSWorkerService) {}
}
