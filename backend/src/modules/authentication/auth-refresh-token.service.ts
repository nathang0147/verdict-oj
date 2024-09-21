import {ConfigService} from "@nestjs/config";
import {EnvironmentVariables} from "@configs/env/configuration.config";
import {InjectRepository} from "@nestjs/typeorm";
import {RefreshToken} from "@modules/authentication/entities/refresh.token.entity";
import {LessThanOrEqual, Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {TokenPayLoad} from "@modules/authentication/interfaces/token.interface";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule";
import {accessTokenPrivateKey, refreshTokenPrivateKey} from "../../contraints/jwt.contraints";

@Injectable()
export class AuthRefreshTokenService{
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService<EnvironmentVariables>,
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
    ) {}

    generateToken(payload: TokenPayLoad){
        return this.jwtService.sign(payload,{
            algorithm: 'RS256',
            privateKey: accessTokenPrivateKey,
            expiresIn:  this.configService.get<string>('accessTokenExpiredTime'),
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
                algorithm: 'RS256',
                privateKey: refreshTokenPrivateKey,
                expiresIn: this.configService.get<string>('refreshTokenExpiredTime'),
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

    async generateTokenPair(
        payLoad: TokenPayLoad,
        currentRefreshToken?: string,
        currentRefreshTokenExpiredAt?: Date,
    ){
        const accessToken = this.generateToken(payLoad)
        const refreshToken = await this.generateRefreshToken(
            payLoad,
            currentRefreshToken,
            currentRefreshTokenExpiredAt
        )

        return {
            accessToken,
            refreshToken,
        }
    }
    
    @Cron(CronExpression.EVERY_DAY_AT_6AM)
    async clearExpiredRefreshToken(){
        await this.refreshTokenRepository.delete({
            expiresAt: LessThanOrEqual(new Date()),
        })
    }
}