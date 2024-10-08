import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {SubmissionLanguage, SubmissionStatus} from "@modules/submission/entities/enum/submission.enum";
import {Problem} from "@modules/problem/entities/problem.entity";
import {User} from "@modules/user/entities/user.entity";
import {BaseNumIdEntity} from "@modules/share/base/baseNumId.entity";

@Entity('t_submission')
export class Submission extends BaseNumIdEntity {
    @ManyToOne(type => User, user => user.id)
    @JoinColumn({ name: 'userId' })
    userId: string; //relation with user

    @ManyToOne(type => Problem, problem => problem.id)
    @JoinColumn({ name: 'problemId' })
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
        enum: SubmissionStatus,
        nullable: true
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

    @Column({nullable: true})
    input: string;

    @Column({nullable: true})
    output: string;

    @Column({nullable: true})
    expectedOutput: string;
}