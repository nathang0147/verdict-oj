import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {SubmissionLanguage, SubmissionStatus} from "@modules/submission/entities/enum/submission.enum";
import {BaseEntity} from "@modules/share/base/base.entity";
import {Problem} from "@modules/problem/entities/problem.entity";
import {User} from "@modules/user/entities/user.entity";

@Entity('t_submission')
export class Submission extends BaseEntity{
    @Column()
    @ManyToOne(type => User, user => user.id)
    userId: string; //relation with user

    @Column()
    @ManyToOne(type => Problem, problem => problem.id)
    problemId: string; //relation with problem

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