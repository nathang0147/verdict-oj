import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "@modules/user/entities/user.entity";

@Entity({name: '_refreshTokens'})
export class RefreshToken{

    @PrimaryColumn()
    refreshToken: string

    @Column()
    expiresAt: Date;

    @Column({name: "user_id"})
    userId: string;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: "user_id"})
    user: User;
}