import {Submission} from "@modules/submission/entities/submission.entity";
import {BaseRepositoryInterface} from "@repositories/base/base.interface.repository";
import {FindAllResponse} from "../../../types/common.type";
import {Problem} from "@modules/problem/entities/problem.entity";
import {User} from "@modules/user/entities/user.entity";
import {SubmissionStatus} from "@modules/submission/entities/enum/submission.enum";

export interface SubmissionRepositoryInterface extends BaseRepositoryInterface<Submission>{
    getSubmissionByUserIdAndProblemId(userId: string, problemId: number): Promise<Submission[]>;

    getSubmissionByUserId(userId: string): Promise<FindAllResponse<Submission>>;

    getSubmissionByProblemId(problemId: number): Promise<FindAllResponse<Submission>>;

    getTotalSubmissionsCount(): Promise<number>;

    getTotalSubmissionsCountByProblemId(problemId: number): Promise<number>;

    getSubmissionsList(page: number): Promise<any[]>;

    getSubmissionListByProblemId(problemId: number, page: number): Promise<any[]>;

    getProblem(submissionId: number): Promise<Problem>;

    getUser(submissionId: number): Promise<User>;

    getSubmissionWithStatus(submissionId: number, status: SubmissionStatus): Promise<Submission>;
}