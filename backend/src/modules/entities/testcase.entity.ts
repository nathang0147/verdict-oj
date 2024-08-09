import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Problem} from "@modules/entities/problem.entity";

@Entity('t_testcase')
export class Testcase{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @ManyToOne(type => Problem, problem => problem.id)
    problemId: number;

    @Column()
    input: string;

    @Column()
    output: string;

    @Column({type: 'timestamp'})
    expiredAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}