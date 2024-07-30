import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Exclude} from "class-transformer"

@Entity({name: '_user'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    rank: number;

    @Column()
    steak: number;

    @Column()
    accountLocked: boolean;

    @Column()
    enable: boolean;

    @Column({
        type: "enum",
        enum: ["user", "admin"],
        default: "user"
    })
    role: string;
}