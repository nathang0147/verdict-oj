import { Column, Entity, OneToMany} from "typeorm";
import {ProblemTag} from "@modules/problem-tag/entities/problem-tag.entity";
import {BaseEntity} from "@modules/share/base/base.entity";
import {BaseNumIdEntity} from "@modules/share/base/baseNumId.entity";

@Entity('t_tag')
export class Tag extends BaseNumIdEntity {
    @Column()
    name: string;

    @OneToMany(() => ProblemTag, problemTag => problemTag.tagId)
    problemTags: ProblemTag[];
}