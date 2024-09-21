import { Column, Entity, ManyToOne} from "typeorm";
import {BaseEntity} from "@modules/share/base/base.entity";
import {BaseNumIdEntity} from "@modules/share/base/baseNumId.entity";

@Entity('t_problem_tag')
export class ProblemTag extends BaseNumIdEntity {

    @ManyToOne(() => ProblemTag, problemTag => problemTag.problemId)
    problemId: number;


    @ManyToOne(() => ProblemTag, problemTag => problemTag.tagId)
    tagId: number;
}