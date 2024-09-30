import {Injectable, NotFoundException} from '@nestjs/common';
import { Submission } from '@modules/index/entities/submission.entity';
import { Problem } from '@modules/index/entities/problem.entity';
import { Testcase } from '@modules/index/entities/testcase.entity';
import { TestcaseRepository,SubmissionRepository, ProblemRepository} from '@repositories/index.repository';
import {BaseServiceAbstract} from "./base/base.abstract.service";

@Injectable()
export class SubmissionService extends BaseServiceAbstract<Submission> {
    constructor(private readonly submissionRepository: SubmissionRepository) {
        super(submissionRepository);
    }
    async getSubmissionById(id: number) {
        return this.submissionRepository.findOneById(id).catch((error) => {throw new NotFoundException('Submission not found')});
    }
}

@Injectable()
export class ProblemService extends BaseServiceAbstract<Problem> {
    constructor(private readonly problemRepository: ProblemRepository) {
        super(problemRepository);
    }
}

@Injectable()
export class TestcaseService extends BaseServiceAbstract<Testcase> {
    constructor(private readonly testcaseRepository: TestcaseRepository) {
        super(testcaseRepository);
    }

    async getTestcaseByProblemId(problemId: number) {
        return this.testcaseRepository.findOneByCondition({problemId}).catch((error) => {throw new NotFoundException('Testcase not found')});
    }
}