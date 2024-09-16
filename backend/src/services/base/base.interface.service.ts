import { FindAllResponse } from 'src/types/common.type';
import {DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere} from "typeorm";
import {FindDto} from "../../api/utils/find.dto";

export interface Write<T> {
    create(item: T | DeepPartial<T>): Promise<T>;
    update(id: string | number, item: DeepPartial<T>): Promise<T>;
    remove(id: string | number): Promise<boolean>;
}

export interface Read<T> {
    findAll(
        filter?: object,
        option?: object,
    ): Promise<FindAllResponse<T>>;
    findOne(id: string | number): Promise<T>;
    findOneByCondition(condition: FindOptionsWhere<T>, projection?: (keyof T)[]): Promise<T>;
}

export interface BaseServiceInterface<T> extends Write<T>, Read<T> {
}
