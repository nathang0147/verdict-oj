import {BaseEntity, Column, Entity} from "typeorm";

@Entity('t_tag')
export class Tag extends BaseEntity {
    @Column()
    name: string;
}