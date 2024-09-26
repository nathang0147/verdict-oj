import {Expose} from "class-transformer";
import { PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "@modules/share/base/base.entity";

export abstract class BaseNumIdEntity extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    @Expose()
    id?: number;
}