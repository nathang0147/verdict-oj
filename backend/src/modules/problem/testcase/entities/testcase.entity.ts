import {Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('t_testcase')
export class Testcase{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
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