import {Body, Controller, Get} from '@nestjs/common';
import { ReceiverService } from './receiver.service';
import {MessagePattern} from "@nestjs/microservices";

@Controller('receiver')
export class ReceiverController {
  constructor(private readonly receiverService: ReceiverService) {}

  @MessagePattern({cmd: 'verdict'})
  async receiveSubmissionId(payload: number){
    await this.receiverService.handleMessage(payload);
  }

  @Get()
  async receive(@Body('payload') payload: number){
    return await this.receiverService.handleMessage(payload)
  }
}
