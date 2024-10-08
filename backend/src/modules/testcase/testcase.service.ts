import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {TestcaseRepositoryInterface} from "@modules/testcase/interfaces/testcase.interface";
import {BaseServiceAbstract} from "../../services/base/base.abstract.service";
import {Testcase} from "@modules/testcase/entities/testcase.entity";
import {ProblemRepositoryInterface} from "@modules/problem/interface/problem.interface";
import {CreateTestcaseDto} from "@modules/testcase/dto/create.testcase.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Problem} from "@modules/problem/entities/problem.entity";
import {Repository} from "typeorm";

@Injectable()
export class TestcaseService extends BaseServiceAbstract<Testcase>{
    constructor(
        @Inject('TestcaseRepositoryInterface')
        private readonly testcaseRepository: TestcaseRepositoryInterface,

        @InjectRepository(Problem)
        private readonly problemRepository: Repository<Problem>,
    ) {
        super(testcaseRepository);
    }

    async getSampleTestcases(problemId: number, numberCases: number) {
        return await this.testcaseRepository.getSampleTestcases(problemId, numberCases);
    }

    async searchTestcasesByProblemId(problemId: number, input?: string, output?: string) {
        return await this.testcaseRepository.searchTestcasesByProblemId(problemId, input, output);
    }


    async addTestcase(problemId: number,testcase: CreateTestcaseDto): Promise<number>{
        const newTestcase = await this.testcaseRepository.create({problemId,...testcase});
        return newTestcase.id;
    }


}
