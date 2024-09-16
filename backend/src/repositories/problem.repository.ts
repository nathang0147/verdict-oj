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
import {ProblemTag} from "@modules/problem-tag/entities/problem-tag.entity";
import {SubmitDto} from "@modules/problem/dto/submit.dto";

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
        private readonly testcaseRepository: Repository<Testcase>,

        @InjectRepository(ProblemTag)
        private readonly problemTagRepository: Repository<ProblemTag>
    ) {
        super(problemRepository);
    }

    async searchProblems(code?: string, title?: string): Promise<Problem[]> {
        return await this.problemRepository.createQueryBuilder('problem')
            .where(code ? 'problem.code = :code' : '1=1', {code})
            .andWhere(title ? 'problem.title LIKE :title' : '1=1', {title})
            .getMany();
    }

    async getSubmissionByProblemId(problemId: number): Promise<Submission[]> {
        return await this.submissionRepository.find({
            where: {problemId},
            order: {createdAt: "DESC"},
        });
    }

    async getSubmissionByUserIdAndProblemId(userId: string, problemId: number): Promise<Submission[]> {
        return await this.submissionRepository.find({
            where: {
                userId,
                problemId,
                status: SubmissionStatus.STATUS_ACCEPTED
            },
        });
    }

    async searchTestcasesByProblemId(problemId: number, input?: string, output?: string): Promise<Testcase[]> {
        return await this.testcaseRepository.findBy({
            problemId,
            input: input ? input : undefined,
            output: output ? output : undefined
        })
    }

    async submit(submitDto : SubmitDto): Promise<number> {
        const submitAnswer =  this.submissionRepository.create(submitDto);

        const savedAnswer = await this.submissionRepository.save(submitAnswer);

        return savedAnswer.id;


    }

    async getTotalProblemsCount(): Promise<number> {
        return await this.problemRepository.count();
    }

    async getSubmissionCount(problemId: number): Promise<number> {
        return await this.submissionRepository.count(
            {where: {problemId}}
        );
    }

    async getAcceptedSubmissionCount(problemId: number): Promise<number> {
        return await this.submissionRepository.count(
            {where: {
                problemId,
                status: SubmissionStatus.STATUS_ACCEPTED
            }});
    }

    async findOneWithRelations(id: number, relation: FindOptionsRelations<Problem>): Promise<Problem> {
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
    async getProblemsWithTag(tags: string): Promise<any[]> {
        return this.problemTagRepository.createQueryBuilder('pt')
            .select([
                'p.id AS id',
                'p.title AS title',
                'p.description AS description',
                'p.difficulty AS difficulty',
                'p.runtimeLimit AS runtime',
                'p.memoryLimit AS memory',
                'p.hint AS hint',
                't.name AS tag',
                'p.createdAt AS createdAt',
            ])
            .leftJoin('pt.problemId', 'p')
            .leftJoin('pt.tagId', 't')
            .where('t.name IN (:...tags)', {tags: tags.split(',')})
            .orderBy('p.id', 'DESC')
            .getRawMany()

    }
    async getProblemsWithDifficulty(difficulty: number): Promise<FindAllResponse<Problem>> {
        return await this.findAllWithSubFields({difficulty}, {limit: -1, offset: 0});
    }
}