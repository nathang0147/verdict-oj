import {Inject, Injectable} from '@nestjs/common';
import {BaseServiceAbstract} from "../../services/base/base.abstract.service";
import {Submission} from "@modules/submission/entities/submission.entity";
import {SubmissionRepositoryInterface} from "@modules/submission/interfaces/submission.interface";
import {FindAllResponse} from "../../types/common.type";

@Injectable()
export class SubmissionService extends BaseServiceAbstract<Submission> {
    constructor(
        @Inject('SubmissionsRepositoryInterface')
        private readonly submissionRepository: SubmissionRepositoryInterface
    ) {
        super(submissionRepository);
    }

    async getSubmissionByUserIdAndProblemId(userId: string, problemId: number): Promise<Submission[]> {
        return await this.submissionRepository.getSubmissionByUserIdAndProblemId(userId, problemId);
    }

    async getSubmissionByUserId(userId: string): Promise<Submission[]> {
        const {count, items} = await this.submissionRepository.findAll({userId});

        return items;
    }

    async getSubmissionByProblemId(problemId: string): Promise<Submission[]> {
        const {count, items} = await this.submissionRepository.findAll({problemId});

        return items;
    }

    async getTotalSubmissionsCount(): Promise<number> {
        return await this.submissionRepository.getTotalSubmissionsCount();
    }

    async getTotalSubmissionsCountByProblemId(problemId: number): Promise<number> {
        return await this.submissionRepository.getTotalSubmissionsCountByProblemId(problemId);
    }

    async getSubmissionsList(page: number): Promise<any[]> {
        return await this.submissionRepository.getSubmissionsList(page);
    }

    async getSubmissionListByProblemId(problemId: number, page: number): Promise<any[]> {
        return await this.submissionRepository.getSubmissionListByProblemId(problemId, page);
    }

    async getSubmissionAndProblem(submissionId: number): Promise<any> {
        const submission = await this.submissionRepository.findOneById(submissionId);
        if (!submission) {
            throw new Error('Submission not found');
        }

        const problem = await this.submissionRepository.getProblem(submission.problemId);
        const user = await this.submissionRepository.getUser(submissionId);

        return {
            submission,
            problem,
            user
        };
    }

    async getSubmissionPagination( page: number, limit: number): Promise<any> {
        const count = await this.submissionRepository.getTotalSubmissionsCount();

        const pagination = calculatePagination(count, page, limit);

        return {
            pagination,
            items: await this.submissionRepository.getSubmissionsList(page)
        };
    }


}

function calculatePagination(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const offset = (currentPage - 1) * pageSize;

    return {
        totalItems,
        currentPage,
        pageSize,
        totalPages,
        offset,
    };
}
