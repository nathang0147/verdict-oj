import {Column, Entity, OneToMany} from "typeorm";
import {Exclude} from "class-transformer"
import Role from "@modules/authorization/contrants/role.enum";
import {BaseUUIDEntity} from "@modules/share/base/baseUUID.entity";
import {Submission} from "@modules/submission/entities/submission.entity";

@Entity({name: '_user'})
export class User extends BaseUUIDEntity{
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

    @OneToMany(()=>Submission, submission => submission.userId)
    submissions: Submission[];
}