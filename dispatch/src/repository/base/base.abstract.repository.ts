import {DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository} from "typeorm";
import {BaseRepositoryInterface} from "@repositories/base/base.interface.repository";
import {BaseEntity} from "@modules/share/base/base.entity";
import {FindAllResponse} from "../../common/common.type";
import {FindDto} from "../../api/utils/find.dto";
import {isNumber} from "../../common/common.function";


export abstract class BaseRepositoryAbstract<T extends BaseEntity>
    implements BaseRepositoryInterface<T>
{
    protected constructor(private readonly model: Repository<T>) {
        this.model = model;
    }

    async create(dto: T| DeepPartial<T>): Promise<T> {
        const entity =  this.model.create(dto as T | any);
        return this.model.save(entity as T | any);
    }

    async findOneById(
        id:  string | number,
        projection?: (keyof T)[],
        options?: FindOneOptions<T>,
    ): Promise<T | null> {
        const parsedId = isNumber(id)? Number(id): id;

        const findOptions: FindOneOptions<T> = {
            where: { id: parsedId } as any,
            select: projection,
            ...options
        };
        const item = await this.model.findOne(findOptions);
        return item?.deletedAt ? null : item;
    }

    async findOneByCondition(condition: FindOptionsWhere<T>, projection?: (keyof T)[]): Promise<T> {
        return await this.model.findOne({
            where: condition,
            select: projection});
    }

    async findAll(
        condition?: FindOptionsWhere<T>,
        options?: FindOneOptions<T>,
    ): Promise<FindAllResponse<T>> {
        const [items, count] = await this.model.findAndCount({
            where: {condition, deletedAt:null} as any,
            select: options?.select,
        });
        return { count, items };
    }

    async update(id: string | number, dto: Partial<T>): Promise<T | null> {
        const parsedId = isNumber(id)? Number(id): id;
        await this.model.update({id: parsedId} as any, dto as any);
        return await this.model.findOne({
            where: {id: parsedId, deletedAt: null} as any,
        })
    }

    async softDelete(id: string | number): Promise<boolean> {
        const parsedId = isNumber(id)? Number(id): id;

        const item = await this.model.findOne({
            where: {id: parsedId} as any,
        });
        if(!item) return false;

        const result = await this.model.update({id: parsedId} as any, {deletedAt: new Date()} as any);

        return result.affected ===1;
    }

    async permanentDelete(id: string | number): Promise<boolean> {
        const parsedId = isNumber(id)? Number(id): id;

        const result = await this.model.delete({id: parsedId} as any);
        return result.affected ===1;
    }
}