import {Inject, Injectable} from '@nestjs/common';
import {TestcaseRepositoryInterface} from "@modules/testcase/interfaces/testcase.interface";

@Injectable()
export class TestcaseService {
    constructor(
        @Inject('TestcaseRepositoryInterface')
        private readonly testcaseRepository: TestcaseRepositoryInterface
    ) {}

    async getSampleTestcases(problemId: string, numberCases: number) {
        return await this.testcaseRepository.getSampleTestcases(problemId, numberCases);
    }

    async searchTestcasesByProblemId(problemId: string, input?: string, output?: string) {
        return await this.testcaseRepository.searchTestcasesByProblemId(problemId, input, output);
    }
}
