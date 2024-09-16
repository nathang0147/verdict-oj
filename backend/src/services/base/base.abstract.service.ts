import {BaseEntity} from "@modules/share/base/base.entity";
import {BaseServiceInterface} from "./base.interface.service";
import {BaseRepositoryInterface} from "@repositories/base/base.interface.repository";
import {DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere} from "typeorm";
import {FindAllResponse} from "../../types/common.type";
import {FindDto} from "../../api/utils/find.dto";
import {isNumber} from "../../utils/type-guards";

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

    async findOne(id: string | number): Promise<T> {
        const parsedId = isNumber(id)? Number(id): id;
        return await this.repository.findOneById(parsedId);
    }

    async findOneByCondition(condition: FindOptionsWhere<T>, filter?: (keyof T)[]): Promise<T> {
        if (!condition || Object.keys(condition).length === 0) {
            throw new Error("You must provide selection conditions in order to find a single row.");
        }
        return await this.repository.findOneByCondition(condition, filter);
    }

    async update(id: string | number, item: DeepPartial<T>): Promise<T> {
        const parsedId = isNumber(id)? Number(id): id;
        return this.repository.update(parsedId, item);
    }

    async remove(id: string | number): Promise<boolean> {
        const parsedId = isNumber(id)? Number(id): id;
        return this.repository.softDelete(parsedId);
    }

    async delete(id: string | number): Promise<boolean> {
        const parsedId = isNumber(id)? Number(id): id;
        return this.repository.permanentDelete(parsedId);
    }
}