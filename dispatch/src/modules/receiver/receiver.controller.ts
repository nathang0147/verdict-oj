import { Controller } from '@nestjs/common';
import { ReceiverService } from './receiver.service';
import {MessagePattern} from "@nestjs/microservices";

@Controller()
export class ReceiverController {
  constructor(private readonly receiverService: ReceiverService) {}

  @MessagePattern({cmd: 'verdict'})
  receiveSubmissionId(payload: number){
    this.receiverService.handleMessage(payload);
  }
}
