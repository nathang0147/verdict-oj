import {Controller, Get, Param} from '@nestjs/common';
import { IndexService } from './index.service';
import {ProblemService, SubmissionService, TestcaseService} from "../../services/index.service";

@Controller('/api')
export class IndexController {
  constructor(
      private readonly indexService: IndexService,
      private readonly submissionService: SubmissionService ,
      private readonly testcaseService: TestcaseService,
      private readonly problemService: ProblemService
              ) {}

  @Get('/submission')
    async getSubmission(@Param() id: number) {
        return this.submissionService.getSubmissionById(id);
    }
}
