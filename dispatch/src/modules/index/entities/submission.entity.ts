import {BeforeUpdate, Column, Entity} from "typeorm";
import {SubmissionLanguage, SubmissionStatus} from "@modules/index/entities/enum/submission.enum";
import {BaseNumIdEntity} from "@modules/share/base/baseNumId.entity";

@Entity('t_submission')
export class Submission extends BaseNumIdEntity {
    @Column()
    userId: string; //relation with user

    @Column()
    problemId: number; //relation with problem

    @Column()
    code: string;

    @Column({
        type: "enum",
        enum: SubmissionLanguage,
    })
    language: SubmissionLanguage;

    @Column({
        type: "enum",
        enum: SubmissionStatus
    })
    status: SubmissionStatus;

    @Column({nullable: true})
    error: string;

    @Column({
        type: "float",
        nullable: true
    })
    runtime: number

    @Column({
        type: "float",
        nullable: true
    })
    memory: number;

    @Column()
    input: string;

    @Column()
    output: string;

    @Column()
    expectedOutput: string;
}