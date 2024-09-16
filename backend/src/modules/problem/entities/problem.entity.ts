import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {BaseEntity} from "@modules/share/base/base.entity";
import {Exclude} from "class-transformer";
import {Submission} from "@modules/submission/entities/submission.entity";
import {ProblemTag} from "@modules/problem-tag/entities/problem-tag.entity";
import {BaseNumIdEntity} from "@modules/share/base/baseNumId.entity";
import {Testcase} from "@modules/testcase/entities/testcase.entity";

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
    difficulty: number;

    @Column()
    @Exclude()
    runtimeLimit: number;

    @Column()
    @Exclude()
    memoryLimit: number;

    @Column()
    hint: string;

    @OneToMany(()=> ProblemTag, problemTag => problemTag.problemId)
    problemTags: ProblemTag[];

    @OneToMany(() => Submission, submission => submission.problemId)
    submissions: Submission[];

    @OneToMany(() => Testcase, testcase => testcase.problemId)
    testcases: Testcase[];
}