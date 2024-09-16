import {Exclude, Expose} from "class-transformer";
import {Column, Entity} from "typeorm";
import {BaseNumIdEntity} from "@modules/share/base/baseNumId.entity";

export enum USER_ROLES{
    ADMIN = 'Admin',
    USER = 'User'
}

@Exclude()
@Entity({name: 'user_roles'})
export class UserRoles extends BaseNumIdEntity{
    @Column({
        unique: true,
        default: USER_ROLES.USER,
        enum: USER_ROLES,
        nullable: false
    })
    @Expose({ name: 'role', toPlainOnly: true })
    name: string;

    @Column({
        nullable: true
    })
    @Expose()
    _description: string;
}