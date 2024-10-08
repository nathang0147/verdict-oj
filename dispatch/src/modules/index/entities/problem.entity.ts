import {Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Exclude} from "class-transformer";
import {BaseNumIdEntity} from "@modules/share/base/baseNumId.entity";
import {Testcase} from "@modules/index/entities/testcase.entity";

export enum PROBLEM_STATUS {
    UNSOLVED=0,
    TRIED=1,
    SOLVED=2,
}

@Entity('t_problem')
export class Problem extends BaseNumIdEntity{
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    sampleInput: string;

    @Column()
    sampleOutput: string;

    @Column()
    methodName: string;

    @Column()
    difficulty: number;

    @Column({
        type: 'float',
    })
    @Exclude()
    runtimeLimit: number;

    @Column({
        type: 'float',
    })
    @Exclude()
    memoryLimit: number;

    @Column()
    hint: string;
}