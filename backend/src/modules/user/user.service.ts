import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {BaseServiceAbstract} from "../../services/base/base.abstract.service";
import {User} from "./entities/user.entity";
import {UsersRepositoryInterfaces} from "@modules/user/interfaces/users.interfaces";
import {CreateUserDto} from "@modules/user/dto/create.user.dto";
import {FindManyOptions, FindOptionsWhere} from "typeorm";
import {FindAllResponse} from "../../types/common.type";
import {FindDto} from "../../api/utils/find.dto";
import {UpdateUserDto} from "@modules/user/dto/update.user.dto";
import {UserRolesService} from "@modules/user-roles/user-roles.service";
import {USER_ROLES} from "@modules/user-roles/entities/user-roles.entities";

@Injectable()
export class UserService extends BaseServiceAbstract<User>{
    constructor(
        @Inject('UsersRepositoryInterface')
        private readonly usersRepository: UsersRepositoryInterfaces,
        private readonly userRolesService: UserRolesService
    ) {
        super(usersRepository);
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        let userRole = await this.userRolesService.findOneByCondition({
            where: {name: USER_ROLES.USER}
        })

        if(!userRole){
            userRole = await this.userRolesService.create({
                name: USER_ROLES.USER
            })
        }

        const user = await this.usersRepository.create({
            ...createUserDto,
            role: userRole
        });
        return user;
    }

    async findAll(filter?:FindOptionsWhere<User>, options?:FindDto<User>) : Promise<FindAllResponse<User>>{
        return await this.usersRepository.findAllWithSubFields(filter, {
            ...options,
        });
    }

}
