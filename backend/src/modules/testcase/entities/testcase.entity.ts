import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Problem} from "@modules/problem/entities/problem.entity";
import {BaseEntity} from "@modules/share/base/base.entity";

@Entity('t_testcase')
export class Testcase extends BaseEntity{
    @Column()
    @ManyToOne(type => Problem, problem => problem.id, {onDelete: 'CASCADE'})
    problemId: string;

    @Column()
    input: string;

    @Column()
    output: string;

    @Column({type: 'timestamp'})
    expiredAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}