import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import {UserService} from "@modules/user/user.service";
import {TokenPayLoad} from "@modules/authentication/interfaces/token.interface";
import {Injectable} from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'access_token_secret',
        });
    }
    async validate(payload: TokenPayLoad) {
        return await this.userService.findOne(payload.userId);
    }
}