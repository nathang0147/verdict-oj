import { FindAllResponse } from "../../types/common.type";
import {DeepPartial, FindManyOptions, FindOneOptions} from "typeorm";
import {FindDto} from "../../api/utils/find.dto";

export interface BaseRepositoryInterface<T> {
    /**
     * Creates a new entity based on the provided DTO.
     * @param dto The data transfer object (DTO) used to create the new entity.
     * @returns A promise that resolves with the created entity.
     */
    create(dto: T | any): Promise<T>;

    /**
     * Finds a single entity by its ID.
     * @param id The ID of the entity to find.
     * @param projection Optional projection to specify which fields to retrieve.
     * @param option Optional options to specify which condition to retrieve.
     * @returns A promise that resolves with the found entity.
     */
    findOneById(id: string | number, projection?: (keyof T)[], option?: object): Promise<T>;

    /**
     * Finds a single entity by a specific condition.
     * @param condition The condition to use for finding the entity.
     * @param projection Optional projection to specify which fields to retrieve.
     * @returns A promise that resolves with the found entity.
     */
    findOneByCondition(condition: object, projection?: (keyof T)[]): Promise<T>;

    /**
     * Finds all entities matching a specific condition.
     * @param condition The condition to use for finding the entities.
     * @param option Optional options to specify which fields to retrieve.
     * @returns A promise that resolves with an object containing the total count and an array of the found entities.
     */
    findAll(condition?: object, option?: object): Promise<FindAllResponse<T>>;

    /**
     * Updates an existing entity based on its ID and the provided DTO.
     * @param id The ID of the entity to update.
     * @param dto The data transfer object (DTO) containing the updated fields.
     * @returns A promise that resolves with the updated entity.
     */
    update(id: string | number, dto: DeepPartial<T>): Promise<T>;

    /**
     * Soft deletes an entity based on its ID.
     * @param id The ID of the entity to soft delete.
     * @returns A promise that resolves with a boolean indicating the success of the operation.
     */
    softDelete(id: string | number): Promise<boolean>;

    /**
     * Permanently deletes an entity based on its ID.
     * @param id The ID of the entity to permanently delete.
     * @returns A promise that resolves with a boolean indicating the success of the operation.
     */
    permanentDelete(id: string| number): Promise<boolean>;
}
