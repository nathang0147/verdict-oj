import { FindAllResponse } from 'src/types/common.type';
import {DeepPartial, FindManyOptions, FindOneOptions} from "typeorm";
import {FindDto} from "../../api/utils/find.dto";

export interface Write<T> {
    create(item: T | DeepPartial<T>): Promise<T>;
    update(id: number, item: DeepPartial<T>): Promise<T>;
    remove(id: number): Promise<boolean>;
}

export interface Read<T> {
    findAll(
        filter?: object,
        option?: object,
    ): Promise<FindAllResponse<T>>;
    findOne(id: number): Promise<T>;
    findOneByCondition(condition: FindOneOptions<T>, projection?: (keyof T)[]): Promise<T>;
}

export interface BaseServiceInterface<T> extends Write<T>, Read<T> {
}
