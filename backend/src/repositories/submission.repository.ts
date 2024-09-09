import {BaseRepositoryAbstract} from "@repositories/base/base.abstract.repository";
import {Submission} from "@modules/submission/entities/submission.entity";
import {SubmissionRepositoryInterface} from "@modules/submission/interfaces/submission.interface";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";
import {FindAllResponse} from "../types/common.type";
import {Problem} from "@modules/problem/entities/problem.entity";
import {User} from "@modules/user/entities/user.entity";

@Injectable()
export class SubmissionRepository
    extends BaseRepositoryAbstract<Submission>
    implements SubmissionRepositoryInterface {

    constructor(
        @InjectRepository(Submission)
        private readonly submissionRepository: Repository<Submission>
    ) {
        super(submissionRepository);
    }

    async getSubmissionByUserIdAndProblemId(userId: string, problemId: string): Promise<Submission[]> {
        return await this.submissionRepository.find({
            where: {userId: userId, problemId: problemId},
        });
    }
    async getSubmissionByUserId(userId: string): Promise<FindAllResponse<Submission>> {
        const [items, count] = await this.submissionRepository.findAndCount({
            where: {userId: userId},
        });
        return {count, items};
    }
    async getSubmissionByProblemId(problemId: string): Promise<FindAllResponse<Submission>> {
        const [items, count] = await this.submissionRepository.findAndCount({
            where: {problemId: problemId},
        });
        return {count, items};
    }

    getTotalSubmissionsCount(): Promise<number> {
        return this.submissionRepository.count()
    }
    getTotalSubmissionsCountByProblemId(problemId: string): Promise<number> {
        return this.submissionRepository.count({
            where: {problemId}
        })
    }
    async getSubmissionsList(page: number): Promise<any[]> {
        const limit = parseInt(process.env.PAGINATION_PER_PAGE, 10) || 10;
        const offset = limit * (page - 1);
        const submissions = await this.submissionRepository.createQueryBuilder('s')
            .select([
                's.id AS id',
                'u.username AS username',
                's.problemId AS problem_id',
                'p.title AS problem_title',
                's.language AS language',
                's.status AS status',
                's.runtime AS runtime',
                's.memory AS memory',
                's.created_at AS created_at'
            ])
            .innerJoin(
                qb => qb
                    .select('id')
                    .from(Submission, 'sub')
                    .orderBy('sub.created_at', 'DESC')
                    .limit(limit)
                    .offset(offset),
                't',
                's.id = t.id'
            )
            .leftJoin(Problem, 'p', 's.problemId = p.id')
            .leftJoin(User,'u', 's.userId = u.id')
            .orderBy('s.created_at', 'DESC')
            .getRawMany();
        return submissions;
    }
    getSubmissionListByProblemId(problemId: string, page: number): Promise<any[]> {
        const limit = parseInt(process.env.PAGINATION_PER_PAGE, 10) || 10;
        const offset = limit * (page - 1);
        return this.submissionRepository.createQueryBuilder('s')
            .select([
                's.id AS id',
                'u.username AS username',
                's.language AS language',
                's.status AS status',
                's.runtime AS runtime',
                's.memory AS memory',
                's.created_at AS created_at'
            ])
            .innerJoin(
                qb => qb
                    .select('id')
                    .from(Submission, 'sub')
                    .orderBy('sub.created_at', 'DESC')
                    .limit(limit)
                    .offset(offset),
                't',
                's.id = t.id'
            )
            .leftJoin(Problem, 'p', 's.problemId = p.id')
            .leftJoin(User,'u', 's.userId = u.id')
            .where('s.problemId = :problemId', {problemId})
            .orderBy('s.created_at', 'DESC')
            .getRawMany();
    }

    async getProblem(submissionId: string): Promise<Problem> {
        return await this.submissionRepository.createQueryBuilder('s')
            .select('p.id AS problem_id')
            .innerJoin(Problem, 'p', 's.problemId = p.id')
            .where('s.id = :submissionId', {submissionId})
            .getRawOne();
    }

    async getUser(submissionId: string): Promise<User> {
        return await this.submissionRepository.createQueryBuilder('s')
            .select('u.id AS id')
            .innerJoin(User, 'u', 's.userId = u.id')
            .where('s.id = :submissionId', {submissionId})
            .getRawOne();
    }


}