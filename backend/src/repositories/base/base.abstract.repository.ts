import {DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository} from "typeorm";
import {BaseRepositoryInterface} from "@repositories/base/base.interface.repository";
import {BaseEntity} from "@modules/share/base/base.entity";
import {FindAllResponse} from "../../types/common.type";


export abstract class BaseRepositoryAbstract<T extends BaseEntity>
    implements BaseRepositoryInterface<T>
{
    protected constructor(private readonly model: Repository<T>) {
        this.model = model;
    }

    async create(dto: T| any): Promise<T> {
        const entity = this.model.create(dto as T);
        return await this.model.save(entity);
    }

    async findOneById(
        id: number,
        projection?: (keyof T)[],
    ): Promise<T | null> {
        const findOptions: FindOneOptions<T> = {
            where: { id } as any,
            select: projection,
        };
        const item = await this.model.findOne(findOptions);
        return item?.deletedAt ? null : item;
    }

    async findOneByCondition(condition: FindOneOptions<T>, projection?: (keyof T)[]): Promise<T> {
        return await this.model.findOne({...condition, select: projection});
    }

    async findAll(
        condition?: FindManyOptions<T>,
        projection?: (keyof T)[]
    ): Promise<FindAllResponse<T>> {
        const [items, count] = await this.model.findAndCount({
            where: {...condition, deletedAt:null} as any,
            ...condition,
            select: projection,
        });
        return { count, items };
    }

    async update(id: number, dto: DeepPartial<T>): Promise<T | null> {
        await this.model.update(id, dto as any);
        return await this.model.findOne({
            where: {id, deletedAt: null} as any,
        })
    }

    async softDelete(id: number): Promise<boolean> {
        const item = await this.model.findOne(id as any);
        if(!item) return false;

        const result = await this.model.update(id, {deletedAt: new Date()} as any);

        return result.affected ===1;
    }

    async permanentDelete(id: number): Promise<boolean> {
        const result = await this.model.delete(id);
        return result.affected ===1;
    }
}