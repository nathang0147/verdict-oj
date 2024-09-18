import {Inject, Injectable} from '@nestjs/common';
import {Problem, PROBLEM_STATUS} from "@modules/problem/entities/problem.entity";
import {BaseServiceAbstract} from "../../services/base/base.abstract.service";
import {ProblemRepositoryInterface} from "@modules/problem/interface/problem.interface";
import {FindDto} from "../../api/utils/find.dto";
import {SubmissionLanguage} from "@modules/submission/entities/enum/submission.enum";
import {string} from "joi";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";
import {RedisService} from "@modules/cache/redis.service";
import {SubmitDto} from "@modules/problem/dto/submit.dto";
import {QueueService} from "@modules/queue/queue.service";

@Injectable()
export class ProblemService extends BaseServiceAbstract<Problem>{

    constructor(
        @Inject('ProblemRepositoryInterface')
        private readonly problemRepository: ProblemRepositoryInterface,

        @Inject(CACHE_MANAGER) private cacheService: Cache,

        @Inject()
        private readonly redisService: RedisService,

        @Inject()
        private readonly queueService: QueueService
    ) {
        super(problemRepository);
    }

    async getProblemsWithStatus(userId: string, findDto: FindDto<Problem>) {
        const {items: problems,count} = await this.problemRepository.findAllWithSubFields({}, findDto);

        const result = await Promise.all(problems.map(async (problem) => {

            let status;

            const submissions = await this.problemRepository.getSubmissionByUserIdAndProblemId(userId, problem.id);

            if(submissions){
                status = PROBLEM_STATUS.SOLVED;
            }else{
                //check if a specific problem has been attempted by the user.
                const tried = await this.redisService.getBit(`userTriedKeyCount:${userId}`, problem.id );
                if(tried) {
                    status = PROBLEM_STATUS.TRIED;
                }else {
                    status = PROBLEM_STATUS.UNSOLVED;
                }
            }

            return{
                id: problem.id,
                title: problem.title,
                accepted: await this.problemRepository.getAcceptedSubmissionCount(problem.id),
                total: await this.problemRepository.getSubmissionCount(problem.id),
                difficulty: problem.difficulty,
                status: status,
            }
        }));

        return result;
    }

    async getProblemsWithTag(tag: string) {
        return this.problemRepository.getProblemsWithTag(tag);
    }

    async getProblemsWithDifficulty(difficulty: number) {
        return this.problemRepository.getProblemsWithDifficulty(difficulty);
    }

    async searchProblems(code?: string, title?: string) {
        return this.problemRepository.searchProblems(code, title);
    }

    async getSubmissionByProblemId(problemId: number) {
        return this.problemRepository.getSubmissionByProblemId(problemId);
    }

    async searchTestcasesByProblemId(problemId: number, input?: string, output?: string) {
        return this.problemRepository.searchTestcasesByProblemId(problemId, input, output);
    }

    async submit(submitDto: SubmitDto) {
        if(submitDto.problemId ===null||!Object.values(SubmissionLanguage).includes(submitDto.language)){
            return {
                code: 1,
                message: 'Parameter ProblemId or Language is missing'
            }
        }

        const submissionId = await this.problemRepository.submit(submitDto);

        await this.redisService.setBit(`userTriedKeyCount:${submitDto.userId}`, submitDto.problemId, PROBLEM_STATUS.TRIED)

        await this.queueService.send({id: submissionId})

        return {
            code: 0,
            message: 'Success',
            data: submissionId
        }
    }

    async getAcceptedSubmissionCount(problemId: number) {
        return this.problemRepository.getAcceptedSubmissionCount(problemId);
    }

    async getTotalProblemsCount() {
        return this.problemRepository.getTotalProblemsCount();
    }

    async getSubmissionCount(problemId: number) {
        return this.problemRepository.getSubmissionCount(problemId);
    }

}
