import {Column, Entity} from "typeorm";
import {BaseNumIdEntity} from "@modules/share/base/baseNumId.entity";

@Entity('t_testcase')
export class Testcase extends BaseNumIdEntity{
    @Column()
    problemId: number;

    @Column()
    input: string;

    @Column()
    output: string;
}