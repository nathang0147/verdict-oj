import {BaseEntity} from "@modules/share/base/base.entity";
import {PrimaryGeneratedColumn} from "typeorm";
import {Expose, Transform} from "class-transformer";

export abstract class BaseUUIDEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    @Transform(({ value }) => value?.toString(), { toClassOnly: true })
    id?: string;
}