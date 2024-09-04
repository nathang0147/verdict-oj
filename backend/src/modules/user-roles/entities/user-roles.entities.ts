import {BaseEntity} from "@modules/share/base/base.entity";
import {Exclude, Expose} from "class-transformer";
import {Column, Entity} from "typeorm";
import {IsEnum, IsNotEmpty} from "class-validator";

export enum USER_ROLES{
    ADMIN = 'Admin',
    USER = 'User'
}

@Exclude()
@Entity({name: 'user_roles'})
export class UserRoles extends BaseEntity{
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