import * as bcrypt from 'bcrypt';
import {BadRequestException, ConflictException, Injectable} from '@nestjs/common';
import {UserService} from "@modules/user/user.service";
import {SignUpDto} from "@modules/authentication/dto/sign-up.dto";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {TokenPayLoad} from "@modules/authentication/interfaces/token.interface";
import {AuthRefreshTokenService} from "@modules/authentication/auth-refresh-token.service";

@Injectable()
export class AuthenticationService {
    private SALT_ROUNDS = 11;
    constructor(
        private userService: UserService,
        private refreshTokenService:AuthRefreshTokenService
    ) {}

    async login(userId: string){
        try{
            return this.refreshTokenService.generateTokenPair({userId});
        }catch (error){
            throw error;
        }
    }

    async signUp(signUpDto: SignUpDto){
        try {
            const existedUser = await this.userService.findOneByCondition({email: signUpDto.email});
            if(existedUser){
                throw new ConflictException("User already existed");
            }

            const hashedPassword = await bcrypt.hash(signUpDto.password, this.SALT_ROUNDS);
            const user = await this.userService.create({
                ...signUpDto,
                username: `${signUpDto.email.split('@')[0]}${Math.floor(
                    10 + Math.random() * (999 - 10),
                )}`,
                password: hashedPassword,
            });

            return this.refreshTokenService.generateTokenPair({userId: user.id});
        }catch (error){
            throw error;
        }
    }

    async validateUser(email: string, password: string){
        try{
            const user = await this.userService.getUserByEmail(email);
            await this.verifyPlainContentWithHashedContent(password, user.password);
            return user;
        }catch (e){
            throw e
        }
    }

    private async verifyPlainContentWithHashedContent(plainContent: string, hashedContent: string){
        const isMatch = await bcrypt.compare(plainContent, hashedContent);
        if(!isMatch) {
            throw new BadRequestException();
        }
    }
}
