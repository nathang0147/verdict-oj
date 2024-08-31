import {UsersRepositoryInterfaces} from "@modules/user/interfaces/users.interfaces";

import {BaseRepositoryAbstract} from "@repositories/base/base.abstract.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {FindManyOptions, FindOptionsWhere, Repository} from "typeorm";
import {User} from "@modules/user/entities/user.entity";
import {Injectable} from "@nestjs/common";
import {FindAllResponse} from "../types/common.type";
import {FindDto} from "../api/utils/find.dto";
import {UserRoles} from "@modules/user-roles/entities/user-roles.entities";

@Injectable()
export class UsersRepository
    extends BaseRepositoryAbstract<User>
    implements UsersRepositoryInterfaces
{
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) {
        super(usersRepository);
    }

    async findAllWithSubFields(condition:FindOptionsWhere<User> ,findDto: FindDto<User>): Promise<FindAllResponse<User>>{
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
}