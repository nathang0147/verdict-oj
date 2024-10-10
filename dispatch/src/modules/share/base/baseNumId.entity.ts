import {Expose} from "class-transformer";
import { PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "@modules/share/base/base.entity";
import { LogMethod } from 'src/decorators/log.decorator';

export abstract class BaseNumIdEntity extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    @Expose()
    id?: number;

    getId(): number {
        return this.id;
    }
}