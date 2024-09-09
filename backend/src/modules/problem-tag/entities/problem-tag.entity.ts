import {BaseEntity, Column, Entity} from "typeorm";

@Entity('t_problem_tag')
export class ProblemTag extends BaseEntity {
    @Column()
    problemId: string;

    @Column()
    tagId: string;
}