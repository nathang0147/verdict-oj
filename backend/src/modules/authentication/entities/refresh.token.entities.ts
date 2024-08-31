import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "@modules/user/entities/user.entity";

@Entity({name: '_refreshTokens'})
export class RefreshToken{

    @PrimaryColumn()
    refreshToken: string

    @Column()
    expiresAt: Date;

    @Column()
    userId: number;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: "userId"})
    user: User;
}