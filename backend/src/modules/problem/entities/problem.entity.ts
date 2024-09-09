import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {BaseEntity} from "@modules/share/base/base.entity";
import {Exclude} from "class-transformer";
import {Submission} from "@modules/submission/entities/submission.entity";

export enum PROBLEM_STATUS {
    UNSOLVED=0,
    TRIED=1,
    SOLVED=2,
}

@Entity('t_problem')
export class Problem extends BaseEntity{
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
    hint: string[];

    @Column()
    tags: string[];

    @OneToMany(() => Submission, submission => submission.problemId)
    submissions: Submission[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}