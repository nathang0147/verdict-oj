import {Problem} from "@modules/problem/entities/problem.entity";
import {BaseRepositoryInterface} from "@repositories/base/base.interface.repository";
import {FindOptionsRelations} from "typeorm";
import {FindDto} from "../../../api/utils/find.dto";
import {FindAllResponse} from "../../../common/common.type";
import {Submission} from "@modules/submission/entities/submission.entity";
import {Testcase} from "@modules/testcase/entities/testcase.entity";
import {SubmitDto} from "@modules/problem/dto/submit.dto";

export interface ProblemRepositoryInterface extends BaseRepositoryInterface<Problem>{
    findOneWithRelations(id: number, relation: FindOptionsRelations<Problem>): Promise<Problem>;

    findAllWithSubFields(condition: object, findDto: FindDto<Problem>): Promise<FindAllResponse<Problem>>;

    getProblemsWithTag(tag: string): Promise<any[]>;

    getProblemsWithDifficulty(difficulty: number): Promise<FindAllResponse<Problem>>;

    searchProblems(code?: string, title?: string): Promise<Problem[]>

    getSubmissionByProblemId(problemId: number): Promise<Submission[]>

    getSubmissionByUserIdAndProblemId(userId: string, problemId: number): Promise<Submission[]>

    searchTestcasesByProblemId(problemId: number, input?: string, output?: string): Promise<Testcase[]>

    submit(userId:string ,submitDto : SubmitDto): Promise<number>

    getTotalProblemsCount(): Promise<number>

    getSubmissionCount(problemId: number): Promise<number>

    getAcceptedSubmissionCount(problemId: number): Promise<number>
}