import {Column, Entity, ManyToOne} from "typeorm";
import {SubmissionLanguage, SubmissionStatus} from "@modules/submission/entities/enum/submission.enum";
import {Problem} from "@modules/problem/entities/problem.entity";
import {User} from "@modules/user/entities/user.entity";
import {BaseNumIdEntity} from "@modules/share/base/baseNumId.entity";

@Entity('t_submission')
export class Submission extends BaseNumIdEntity {
    @Column()
    @ManyToOne(type => User, user => user.id)
    userId: string; //relation with user

    @Column()
    @ManyToOne(type => Problem, problem => problem.id)
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

    @Column({nullable: true})
    runtime: number;

    @Column({nullable: true})
    memory: number;

    @Column()
    input: string;

    @Column()
    output: string;

    @Column()
    expectedOutput: string;
}