import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {BaseEntity} from "@modules/share/base/base.entity";

@Entity('t_problem')
export class Problem extends BaseEntity{
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    input: string;

    @Column()
    output: string;

    @Column()
    level: number;

    @Column()
    runtimeLimit: number;

    @Column()
    memoryLimit: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}