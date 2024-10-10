import {Controller, Get, Param} from '@nestjs/common';
import { IndexService } from './index.service';
import {ProblemService, SubmissionService, TestcaseService} from "../../services/index.service";

@Controller('/api')
export class IndexController {
  constructor(
      private readonly submissionService: SubmissionService ,
  ) {}

  @Get('/submission')
    async getSubmission(@Param() id: number) {
        return this.submissionService.getSubmissionById(id);
    }
}
