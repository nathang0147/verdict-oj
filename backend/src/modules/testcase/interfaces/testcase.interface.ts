import {BaseRepositoryInterface} from "@repositories/base/base.interface.repository";
import {Testcase} from "@modules/testcase/entities/testcase.entity";

export interface TestcaseRepositoryInterface extends BaseRepositoryInterface<Testcase>{
    getSampleTestcases(problemId: number, numberCases: number): Promise<Testcase[]>;

    searchTestcasesByProblemId(problemId: number, input?: string, output?: string): Promise<Testcase[]>;
}