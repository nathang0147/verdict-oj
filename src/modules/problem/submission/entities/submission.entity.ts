import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {SubmissionLanguage, SubmissionStatus} from "@modules/problem/submission/enum/submission.enum";

@Entity('t_submission')
export class Submission{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number; //relation with user

    @Column()
    problemId: number; //relation with problem

    @Column()
    code: string;

    @Column({
        type:"enum",
        enum:SubmissionLanguage,
    })
    language: SubmissionLanguage;

    @Column({
        type:"enum",
        enum: SubmissionStatus
    })
    status: SubmissionStatus;

    @Column({nullable:true})
    error: string;

    @Column({nullable:true})
    runtime: number;

    @Column({nullable:true})
    memory: number;

    @Column()
    input: string;

    @Column()
    output: string;

    @Column()
    expectedOutput: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}