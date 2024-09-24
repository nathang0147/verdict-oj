import {BaseRepositoryInterface} from "@repositories/base/base.interface.repository";
import {User} from "../entities/user.entity";
import {FindAllAndCount, FindAllResponse} from "../../../common/common.type";
import {FindDto} from "../../../api/utils/find.dto";
import {FindOptionsWhere} from "typeorm";
import {SearchUserDto} from "@modules/user/dto/search.user.dto";

export interface UsersRepositoryInterfaces extends BaseRepositoryInterface<User>{
    findAllWithSubFields(condition: FindOptionsWhere<User>,findDto: FindDto<User>): Promise<FindAllResponse<User>>;

    getProblemSolvedStatus(userId: string): Promise<any>

    getSubmissionLanguageS(userId: string): Promise<any>

    getAllUserWithAcceptedSubmission(offset: number, limit: number): Promise<any>

    getSolvedProblemsCount(userId: string): Promise<number>

    getSubmissionCount(userId: string): Promise<number>

    getAcceptedSubmissionCount(userId: string): Promise<number>

    getTotalUsersCount(): Promise<number>

    searchUser(searchDto: SearchUserDto): Promise<User[]>;
}