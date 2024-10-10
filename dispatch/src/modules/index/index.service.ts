import {Injectable, NotFoundException} from '@nestjs/common';
import {ProblemService, SubmissionService, TestcaseService} from "../../services/index.service";

@Injectable()
export class IndexService{
    constructor(
        private readonly submissionService: SubmissionService ,
        private readonly testcaseService: TestcaseService,
        private readonly problemService: ProblemService
    ) {}
}
