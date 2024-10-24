import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {BaseServiceAbstract} from "../../services/base/base.abstract.service";
import {User} from "./entities/user.entity";
import {UsersRepositoryInterfaces} from "@modules/user/interfaces/users.interfaces";
import {CreateUserDto} from "@modules/user/dto/create.user.dto";
import {FindManyOptions, FindOptionsWhere} from "typeorm";
import {FindAllResponse} from "../../common/common.type";
import {FindDto} from "../../api/utils/find.dto";
import {UpdateUserDto} from "@modules/user/dto/update.user.dto";
import {UserRolesService} from "@modules/user-roles/user-roles.service";
import {USER_ROLES} from "@modules/user-roles/entities/user-roles.entities";
import {RedisService} from "@modules/cache/redis.service";
import {SearchUserDto} from "@modules/user/dto/search.user.dto";

@Injectable()
export class UserService extends BaseServiceAbstract<User>{
    constructor(
        @Inject('UsersRepositoryInterface')
        private readonly usersRepository: UsersRepositoryInterfaces,
        private readonly redisService: RedisService,

    ) {
        super(usersRepository);
    }

    async create(createUserDto: CreateUserDto): Promise<User> {

        const user = await this.usersRepository.create({
            ...createUserDto
        });
        return user;
    }

    async findAll(filter?:FindOptionsWhere<User>, options?:FindDto<User>) : Promise<FindAllResponse<User>>{
        return await this.usersRepository.findAllWithSubFields(filter, {
            ...options,
        });
    }

    async getUserByEmail(email: string): Promise<User> {
        try {
            const user = await this.usersRepository.findOneByCondition({email})
            return user;
        }catch (e) {
            throw e
        }
    }

    async getUserRanking(offset: number, limit: number): Promise<any>{
        const {count, items} = await this.usersRepository.getAllUserWithAcceptedSubmission(offset, limit);

        const result = await Promise.all(items.map(async (item) => {
            const user = await this.usersRepository.findOneById(item.user_id);
            const submissions = await this.usersRepository.getSubmissionCount(item.user_id);
            const percentage = (await this.usersRepository.getAcceptedSubmissionCount(item.user_id) * 100) / submissions;
            const formattedPercentage = percentage.toFixed(2);
            return {
                username: user.username,
                solved: item.count,
                tried: this.redisService.bitCount(`userTriedCountKey:${item.user_id}`),
                submissions: submissions,
                accepted: submissions === 0 ? 0 : formattedPercentage,
                since: user.createdAt
            }
        }))

        return result;
    }

    async getSolvedProblemsCount(userId: string): Promise<number> {
        return this.usersRepository.getSolvedProblemsCount(userId);
    }

    async getSubmissionLanguageS(userId: string): Promise<any> {
        return this.usersRepository.getSubmissionLanguageS(userId);
    }

    async getProblemSolvedStatus(userId: string): Promise<any> {
        return this.usersRepository.getProblemSolvedStatus(userId);
    }

    async getTotalUsersCount(): Promise<number> {
        return this.usersRepository.getTotalUsersCount();
    }

    async searchUser(searchDto: SearchUserDto){
        return await this.usersRepository.searchUser(searchDto);
    }

}
