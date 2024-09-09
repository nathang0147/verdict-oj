import {BaseRepositoryAbstract} from "@repositories/base/base.abstract.repository";
import {Problem} from "@modules/problem/entities/problem.entity";
import {ProblemRepositoryInterface} from "@modules/problem/interface/problem.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {FindOptionsRelations, FindOptionsWhere, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {FindDto} from "../api/utils/find.dto";
import {FindAllResponse} from "../types/common.type";
import {Submission} from "@modules/submission/entities/submission.entity";
import {Testcase} from "@modules/testcase/entities/testcase.entity";
import {SubmissionLanguage, SubmissionStatus} from "@modules/submission/entities/enum/submission.enum";

@Injectable()
export class ProblemRepository
    extends BaseRepositoryAbstract<Problem>
    implements ProblemRepositoryInterface {
    constructor(
        @InjectRepository(Problem)
        private readonly problemRepository: Repository<Problem>,

        @InjectRepository(Submission)
        private readonly submissionRepository: Repository<Submission>,

        @InjectRepository(Testcase)
        private readonly testcaseRepository: Repository<Testcase>
    ) {
        super(problemRepository);
    }

    async searchProblems(code?: string, title?: string): Promise<Problem[]> {
        return await this.problemRepository.createQueryBuilder('problem')
            .where(code ? 'problem.code = :code' : '1=1', {code})
            .andWhere(title ? 'problem.title LIKE :title' : '1=1', {title})
            .getMany();
    }

    async getSubmissionByProblemId(problemId: string): Promise<Submission[]> {
        return await this.submissionRepository.find({
            where: {problemId},
            order: {createdAt: "DESC"},
        });
    }

    async getSubmissionByUserIdAndProblemId(userId: string, problemId: string): Promise<Submission[]> {
        return await this.submissionRepository.find({
            where: {
                userId,
                problemId,
                status: SubmissionStatus.STATUS_ACCEPTED
            },
        });
    }

    async searchTestcasesByProblemId(problemId: string, input?: string, output?: string): Promise<Testcase[]> {
        return await this.testcaseRepository.find({
            where:{
                problemId,
                ...(input ? {input: input} : {}),
                ...(output ? {output: output} : {}),
            }
        })
    }

    async submit(userId: string, problemId: string, code: string, language: SubmissionLanguage): Promise<string> {
        const submitAnswer =  this.submissionRepository.create({
            userId,
            problemId,
            code,
            language,
            status: SubmissionStatus.STATUS_PENDING
        });

        await this.submissionRepository.save(submitAnswer);

        return submitAnswer.id;
    }

    async getTotalProblemsCount(): Promise<number> {
        return await this.problemRepository.count();
    }

    async getSubmissionCount(problemId: string): Promise<number> {
        return await this.submissionRepository.count(
            {where: {problemId}}
        );
    }

    async getAcceptedSubmissionCount(problemId: string): Promise<number> {
        return await this.submissionRepository.count(
            {where: {
                problemId,
                status: SubmissionStatus.STATUS_ACCEPTED
            }});
    }

    async findOneWithRelations(id: string, relation: FindOptionsRelations<Problem>): Promise<Problem> {
        return await this.problemRepository.findOne({
            where: {id},
            relations: relation
        });

    }
    async findAllWithSubFields(condition: FindOptionsWhere<Problem>, findDto: FindDto<Problem>): Promise<FindAllResponse<Problem>> {
        const [items, count] = await this.problemRepository.findAndCount({
            skip: findDto.offset || 0,
            take: findDto.limit === -1 ? undefined : findDto.limit,
            where: {...condition, deletedAt: null} as any,
            select: findDto.select,
            relations: findDto?.relations
        });

        return {count, items};
    }
    async getProblemsWithTag(tags: string): Promise<FindAllResponse<Problem>> {
        return await this.findAllWithSubFields({tags}, {limit: -1, offset: 0});
    }
    async getProblemsWithDifficulty(difficulty: number): Promise<FindAllResponse<Problem>> {
        return await this.findAllWithSubFields({difficulty}, {limit: -1, offset: 0});
    }
}