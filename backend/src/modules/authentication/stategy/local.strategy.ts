import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {AuthenticationService} from "@modules/authentication/authentication.service";
import {User} from "@modules/user/entities/user.entity";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authenticationService: AuthenticationService){
        super({usernameField: "email"});
    }

    async validate(email: string, password: string): Promise<User>{
        const user = await this.authenticationService.validateUser(email, password);
        if(!user){
            throw new UnauthorizedException();
        }

        return user;
    }
}