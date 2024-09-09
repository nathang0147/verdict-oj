import {Inject, Injectable} from '@nestjs/common';
import {Problem, PROBLEM_STATUS} from "@modules/problem/entities/problem.entity";
import {BaseServiceAbstract} from "../../services/base/base.abstract.service";
import {ProblemRepositoryInterface} from "@modules/problem/interface/problem.interface";
import {FindDto} from "../../api/utils/find.dto";
import {SubmissionLanguage} from "@modules/submission/entities/enum/submission.enum";

@Injectable()
export class ProblemService extends BaseServiceAbstract<Problem>{

    constructor(
        @Inject('ProblemRepositoryInterface')
        private readonly problemRepository: ProblemRepositoryInterface,
    ) {
        super(problemRepository);
    }

    async getProblemsWithStatus(userId: string, findDto: FindDto<Problem>) {
        const userTriedCountKey = 'SampleKey';

        const {items: problems,count} = await this.problemRepository.findAllWithSubFields({}, findDto);

        const result = await Promise.all(problems.map(async (problem) => {

            let status;

            const submissions = await this.problemRepository.getSubmissionByUserIdAndProblemId(userId, problem.id);

            if(submissions){
                status = PROBLEM_STATUS.SOLVED;
            }else{
                //check if a specific problem has been attempted by the user.
                const tried = 0;
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

    async getSubmissionByProblemId(problemId: string) {
        return this.problemRepository.getSubmissionByProblemId(problemId);
    }

    async searchTestcasesByProblemId(problemId: string, input?: string, output?: string) {
        return this.problemRepository.searchTestcasesByProblemId(problemId, input, output);
    }

    async submit(userId: string, problemId: string, code: string, language: SubmissionLanguage) {
        return this.problemRepository.submit(userId, problemId, code, language);
    }

    async getAcceptedSubmissionCount(problemId: string) {
        return this.problemRepository.getAcceptedSubmissionCount(problemId);
    }

    async getTotalProblemsCount() {
        return this.problemRepository.getTotalProblemsCount();
    }

    async getSubmissionCount(problemId: string) {
        return this.problemRepository.getSubmissionCount(problemId);
    }

}
