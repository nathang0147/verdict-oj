import {Submission} from "@modules/submission/entities/submission.entity";
import {BaseRepositoryInterface} from "@repositories/base/base.interface.repository";
import {FindAllResponse} from "../../../types/common.type";
import {Problem} from "@modules/problem/entities/problem.entity";
import {User} from "@modules/user/entities/user.entity";

export interface SubmissionRepositoryInterface extends BaseRepositoryInterface<Submission>{
    getSubmissionByUserIdAndProblemId(userId: string, problemId: string): Promise<Submission[]>;

    getSubmissionByUserId(userId: string): Promise<FindAllResponse<Submission>>;

    getSubmissionByProblemId(problemId: string): Promise<FindAllResponse<Submission>>;

    getTotalSubmissionsCount(): Promise<number>;

    getTotalSubmissionsCountByProblemId(problemId: string): Promise<number>;

    getSubmissionsList(page: number): Promise<any[]>;

    getSubmissionListByProblemId(problemId: string, page: number): Promise<any[]>;

    getProblem(submissionId: string): Promise<Problem>;

    getUser(submissionId: string): Promise<User>;

}