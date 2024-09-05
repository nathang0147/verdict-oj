import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Exclude} from "class-transformer"
import {BaseEntity} from "@modules/share/base/base.entity";
import Role from "@modules/authorization/contrants/role.enum";

@Entity({name: '_user'})
export class User extends BaseEntity{

    @Column()
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({
        type: "enum",
        enum: Role,
        default: Role.USER
    })
    role: string;
}