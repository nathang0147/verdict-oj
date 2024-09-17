import {BaseRepositoryInterface} from "@repositories/base/base.interface.repository";
import {User} from "../entities/user.entity";
import {FindAllAndCount, FindAllResponse} from "../../../types/common.type";
import {FindDto} from "../../../api/utils/find.dto";
import {FindOptionsWhere} from "typeorm";

export interface UsersRepositoryInterfaces extends BaseRepositoryInterface<User>{
    findAllWithSubFields(condition: FindOptionsWhere<User>,findDto: FindDto<User>): Promise<FindAllResponse<User>>;

    getProblemSolvedStatus(userId: string): Promise<any>

    getSubmissionLanguageS(userId: string): Promise<any>

    getAllUserWithAcceptedSubmission(offset: number, limit: number): Promise<any>

    getSolvedProblemsCount(userId: string): Promise<number>

    getSubmissionCount(userId: string): Promise<number>

    getAcceptedSubmissionCount(userId: string): Promise<number>
}