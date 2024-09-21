import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {TestcaseRepositoryInterface} from "@modules/testcase/interfaces/testcase.interface";
import {BaseServiceAbstract} from "../../services/base/base.abstract.service";
import {Testcase} from "@modules/testcase/entities/testcase.entity";
import {ProblemRepositoryInterface} from "@modules/problem/interface/problem.interface";

@Injectable()
export class TestcaseService extends BaseServiceAbstract<Testcase>{
    constructor(
        @Inject('TestcaseRepositoryInterface')
        private readonly testcaseRepository: TestcaseRepositoryInterface,

        @Inject('ProblemRepositoryInterface')
        private readonly problemRepository: ProblemRepositoryInterface
    ) {
        super(testcaseRepository);
    }

    async getSampleTestcases(problemId: number, numberCases: number) {
        return await this.testcaseRepository.getSampleTestcases(problemId, numberCases);
    }

    async searchTestcasesByProblemId(problemId: number, input?: string, output?: string) {
        return await this.testcaseRepository.searchTestcasesByProblemId(problemId, input, output);
    }

    async create(createTestcaseDto: any) {
        const problem = await this.problemRepository.findOneById(createTestcaseDto.problemId);
        if(!problem) {
            throw new NotFoundException('Problem with id ' + createTestcaseDto.problemId + ' not found');
        }
        return await this.testcaseRepository.create(createTestcaseDto);
    }
}
