import {Controller, Get, Param} from '@nestjs/common';
import { IndexService } from './index.service';

@Controller('/api')
export class IndexController {
  constructor(private readonly indexService: IndexService) {}

  @Get('/submission')
    async getSubmission(@Param() id: number) {
        return this.indexService.getSubmissionById(id);
    }
}
