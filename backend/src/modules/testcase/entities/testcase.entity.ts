import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {Problem} from "@modules/problem/entities/problem.entity";
import {BaseNumIdEntity} from "@modules/share/base/baseNumId.entity";

@Entity('t_testcase')
export class Testcase extends BaseNumIdEntity{
    @ManyToOne(type => Problem, problem => problem.id, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'problemId' })
    problemId: number;

    @Column()
    input: string;

    @Column()
    output: string;
}