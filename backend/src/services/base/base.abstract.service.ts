import {BaseEntity} from "@modules/share/base/base.entity";
import {BaseServiceInterface} from "./base.interface.service";
import {BaseRepositoryInterface} from "@repositories/base/base.interface.repository";
import {DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere} from "typeorm";
import {FindAllResponse} from "../../types/common.type";
import {FindDto} from "../../api/utils/find.dto";

export abstract class BaseServiceAbstract<T extends BaseEntity>
    implements BaseServiceInterface<T>
{
    constructor(private readonly repository: BaseRepositoryInterface<T>) {}

    async create(createDTO: T | DeepPartial<T>): Promise<T> {
        return await this.repository.create(createDTO);
    }

    async findAll(filter?:FindOptionsWhere<T>, options?: object): Promise<FindAllResponse<T>> {
        return await this.repository.findAll(filter, options);

    }

    async findOne(id: string): Promise<T> {
        return await this.repository.findOneById(id);
    }

    async findOneByCondition(condition: FindOptionsWhere<T>, filter?: (keyof T)[]): Promise<T> {
        if (!condition || Object.keys(condition).length === 0) {
            throw new Error("You must provide selection conditions in order to find a single row.");
        }
        return await this.repository.findOneByCondition(condition, filter);
    }

    async update(id: string, item: DeepPartial<T>): Promise<T> {
        return this.repository.update(id, item);
    }

    async remove(id: string): Promise<boolean> {
        return this.repository.softDelete(id);
    }
}