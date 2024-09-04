import {ConfigService} from "@nestjs/config";
import {EnvironmentVariables} from "@configs/env/configuration.config";
import {InjectRepository} from "@nestjs/typeorm";
import {RefreshToken} from "@modules/authentication/entities/refresh.token.entity";
import {LessThanOrEqual, Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {TokenPayLoad} from "@modules/authentication/interfaces/token.interface";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule";
import {User} from "@modules/user/entities/user.entity";
import {AuthenticationService} from "@modules/authentication/authentication.service";

@Injectable()
export class AuthRefreshTokenService{
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
    ) {}

    generateToken(payload: TokenPayLoad){
        return this.jwtService.sign(payload,{
            secret: 'access_token_secrete',
            expiresIn: `${this.configService.get<string>(
                'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
            )}s`,
        });
    }

    async generateRefreshToken(
        payLoad: TokenPayLoad,
        currentRefreshToken?: string,
        currentRefreshTokenExpiredAt?: Date
    ){
        const newRefreshToken = this.jwtService.sign(
            payLoad,
            {
                secret: 'access_token_secrete',
                expiresIn: `${this.configService.get<string>(
                    'JWT_REFRESH_TOKEN_EXPIRATION_TIME'
                )}s`,
            })
        if(currentRefreshToken && currentRefreshTokenExpiredAt){
            if(
                await this.isRefreshTokenBackListed(currentRefreshTokenExpiredAt, payLoad.userId)
            ){
                throw new UnauthorizedException('Invalid refresh token');
            }

            await this.refreshTokenRepository.insert({
                refreshToken: currentRefreshToken,
                expiresAt: currentRefreshTokenExpiredAt,
                userId: payLoad.userId,
            })
        }
        return newRefreshToken;
    }

    private isRefreshTokenBackListed(expiresAt: Date, userId: string){
        return this.refreshTokenRepository.existsBy({
            expiresAt,
            userId,
        })
    }

    generateTokenPair(
        payLoad: TokenPayLoad,
        currentRefreshToken?: string,
        currentRefreshTokenExpiredAt?: Date,
    ){

        return {
            accessToken: this.generateToken(payLoad),

            refreshToken: this.generateRefreshToken(
                payLoad,
                currentRefreshToken,
                currentRefreshTokenExpiredAt
            )
        }
    }
    
    @Cron(CronExpression.EVERY_DAY_AT_6AM)
    async clearExpiredRefreshToken(){
        await this.refreshTokenRepository.delete({
            expiresAt: LessThanOrEqual(new Date()),
        })
    }
}