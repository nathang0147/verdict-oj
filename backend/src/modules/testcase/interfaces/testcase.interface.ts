import {BaseRepositoryInterface} from "@repositories/base/base.interface.repository";
import {Testcase} from "@modules/testcase/entities/testcase.entity";

export interface TestcaseRepositoryInterface extends BaseRepositoryInterface<Testcase>{
    getSampleTestcases(problemId: string, numberCases: number): Promise<Testcase[]>;

    searchTestcasesByProblemId(problemId: string, input?: string, output?: string): Promise<Testcase[]>;
}