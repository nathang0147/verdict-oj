import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import {UserService} from "@modules/user/user.service";
import {TokenPayLoad} from "@modules/authentication/interfaces/token.interface";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {accessTokenPublicKey} from "src/contraints/jwt.contraints";
import {AuthenticationError} from "@azure/identity";

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
        const user = await this.userService.findOne(payload.userId);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}