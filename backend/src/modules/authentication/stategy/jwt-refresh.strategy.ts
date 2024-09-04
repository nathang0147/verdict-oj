import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {UserService} from "@modules/user/user.service";
import {TokenPayLoad} from "@modules/authentication/interfaces/token.interface";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {Request} from "express";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'refresh_token_secret',
            passReqToCallback: true,
        });
    }

    async validate(payload: any) {
        const authUser = this.userService.findOne(payload.userId);
        if (!authUser) {
            throw new UnauthorizedException();
        }

        return {
            attributes:authUser,
            refreshTokenExpiredAt: new Date(payload.exp * 1000),
        }
    }
}