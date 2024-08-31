import {BaseRepositoryInterface} from "@repositories/base/base.interface.repository";
import {User} from "../entities/user.entity";
import {FindAllResponse} from "../../../types/common.type";
import {FindDto} from "../../../api/utils/find.dto";
import {FindOptionsWhere} from "typeorm";

export interface UsersRepositoryInterfaces extends BaseRepositoryInterface<User>{
    findAllWithSubFields(condition: FindOptionsWhere<User>,findDto: FindDto<User>): Promise<FindAllResponse<User>>;

    getUserWithRoles(userId: number): Promise<User>;
}