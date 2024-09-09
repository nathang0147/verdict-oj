import {Tag} from "@modules/problem-tag/entities/tag.entity";
import {BaseRepositoryInterface} from "@repositories/base/base.interface.repository";

export interface TagRepositoryInterface extends BaseRepositoryInterface<Tag>{
    searchTags(id: string, name: string): Promise<Tag[]>;
}