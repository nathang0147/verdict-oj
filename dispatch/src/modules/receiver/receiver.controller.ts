import {Body, Controller, Get} from '@nestjs/common';
import { ReceiverService } from './receiver.service';

@Controller('receiver')
export class ReceiverController {
  constructor(private readonly receiverService: ReceiverService) {}


  @Get()
  async receive(@Body('payload') payload: number){
    return await this.receiverService.handleMessage(payload)
  }
}
