import {Problem} from "@modules/problem/entities/problem.entity";
import {BaseRepositoryInterface} from "@repositories/base/base.interface.repository";
import {FindOptionsRelations} from "typeorm";
import {FindDto} from "../../../api/utils/find.dto";
import {FindAllResponse} from "../../../types/common.type";
import {Submission} from "@modules/submission/entities/submission.entity";
import {Testcase} from "@modules/testcase/entities/testcase.entity";
import {SubmissionLanguage} from "@modules/submission/entities/enum/submission.enum";

export interface ProblemRepositoryInterface extends BaseRepositoryInterface<Problem>{
    findOneWithRelations(id: string, relation: FindOptionsRelations<Problem>): Promise<Problem>;

    findAllWithSubFields(condition: object, findDto: FindDto<Problem>): Promise<FindAllResponse<Problem>>;

    getProblemsWithTag(tag: string): Promise<FindAllResponse<Problem>>;

    getProblemsWithDifficulty(difficulty: number): Promise<FindAllResponse<Problem>>;

    searchProblems(code?: string, title?: string): Promise<Problem[]>

    getSubmissionByProblemId(problemId: string): Promise<Submission[]>

    getSubmissionByUserIdAndProblemId(userId: string, problemId: string): Promise<Submission[]>

    searchTestcasesByProblemId(problemId: string, input?: string, output?: string): Promise<Testcase[]>

    submit(userId: string, problemId: string, code: string, language: SubmissionLanguage): Promise<string>

    getTotalProblemsCount(): Promise<number>

    getSubmissionCount(problemId: string): Promise<number>

    getAcceptedSubmissionCount(problemId: string): Promise<number>
}