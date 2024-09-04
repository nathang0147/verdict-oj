import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import {UserService} from "@modules/user/user.service";
import {TokenPayLoad} from "@modules/authentication/interfaces/token.interface";
import {Injectable} from "@nestjs/common";
import {accessTokenPublicKey} from "src/contraints/jwt.contraints";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: accessTokenPublicKey,
        });
    }
    async validate(payload: TokenPayLoad) {
        return await this.userService.findOne(payload.userId);
    }
}