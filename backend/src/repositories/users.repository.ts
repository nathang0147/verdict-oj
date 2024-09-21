import {UsersRepositoryInterfaces} from "@modules/user/interfaces/users.interfaces";

import {BaseRepositoryAbstract} from "@repositories/base/base.abstract.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {FindOptionsWhere, Repository} from "typeorm";
import {User} from "@modules/user/entities/user.entity";
import {Injectable} from "@nestjs/common";
import {FindAllAndCount, FindAllResponse} from "../types/common.type";
import {FindDto} from "../api/utils/find.dto";
import {UserRoles} from "@modules/user-roles/entities/user-roles.entities";
import {Submission} from "@modules/submission/entities/submission.entity";
import {SubmissionStatus} from "@modules/submission/entities/enum/submission.enum";

@Injectable()
export class UsersRepository
    extends BaseRepositoryAbstract<User>
    implements UsersRepositoryInterfaces {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Submission)
        private readonly submissionRepository: Repository<Submission>
    ) {
        super(usersRepository);
    }

    async findAllWithSubFields(condition: FindOptionsWhere<User>, findDto: FindDto<User>): Promise<FindAllResponse<User>> {
        const [items, count] = await this.usersRepository.findAndCount({
            skip: findDto.offset || 0,
            take: findDto.limit === -1 ? undefined : findDto.limit,
            where: {...condition, deletedAt: null} as any,
            select: findDto.select,
            relations: findDto?.relations
        });

        return {count, items};
    }

    async getUserWithRoles(userId: number): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: {id: userId} as any,
            relations: ['role']
        })

        if (user && user.role) {
            user.role = (user.role as unknown as UserRoles).name;
        }
        return user
    }

    async getAllUserWithAcceptedSubmission(offset: number, limit: number): Promise<any> {
        // SELECT `user_id`, count(*) AS count FROM
        //   (SELECT `problem_id`, `user_id` FROM t_submission WHERE status = 0 GROUP BY problem_id, user_id) r
        // GROUP BY `user_id` ORDER BY count DESC;
        return await this.usersRepository.createQueryBuilder()
            .select([
                'r.user_id AS user_id',
                'COUNT(*) AS count'
            ])
            .from(subQuery => {
                return subQuery
                    .select([
                        's.problemId AS problem_id',
                        's.userId AS user_id'
                    ])
                    .from('t_submission', 's')
                    .where('s.status = 0')
                    .groupBy('s.problemId, s.userId')
            }, 'r')
            .groupBy('r.user_id')
            .orderBy('count', 'DESC')
            .skip(offset)
            .take(limit)
            .getRawMany()
    }


    async getSolvedProblemsCount(userId: string): Promise<any> {
        return await this.submissionRepository.createQueryBuilder('s')
            .select('s.problemId AS problem_id')
            .where('s.userId = :userId', {userId})
            .andWhere('s.status = :status', {status: SubmissionStatus.STATUS_ACCEPTED})
            .groupBy('s.problemId')
            .getCount()
    }

    async getProblemSolvedStatus(userId: string): Promise<any> {
        const status = await this.submissionRepository.createQueryBuilder('s')
            .select([
                's.status AS status',
                'COUNT(*) AS count'
            ])
            .where('s.userId = :userId', {userId})
            .groupBy('s.status')
            .getRawMany()
        return status.reduce((acc, cur) => {
            acc[cur.status] = parseInt(cur.count, 10)
            return acc
        }, {} as Record<string, number>)
    }

    async getSubmissionLanguageS(userId: string): Promise<any> {
        const status = await this.submissionRepository.createQueryBuilder('s')
            .select([
                's.language AS language',
                'COUNT(*) AS count'
            ])
            .where('s.userId = :userId', {userId})
            .groupBy('s.language')
            .getRawMany()

        return status.reduce((acc, cur) => {
            acc[cur.language] = parseInt(cur.count, 10)
            return acc
        }, {} as Record<string, number>)
    }

    async getSubmissionCount(userId: string): Promise<number> {
        return await this.submissionRepository.createQueryBuilder('s')
            .where('s.userId = :userId', {userId})
            .getCount()
    }

    async getAcceptedSubmissionCount(userId: string): Promise<number> {
        return await this.submissionRepository.createQueryBuilder('s')
            .where('s.userId = :userId', {userId})
            .andWhere('s.status = :status', {status: SubmissionStatus.STATUS_ACCEPTED})
            .getCount()
    }

    async getTotalUsersCount(): Promise<number> {
        return await this.usersRepository.createQueryBuilder()
            .where('deletedAt IS NULL')
            .getCount()
    }
}