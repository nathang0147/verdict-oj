import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import {UserModule} from "@modules/user/user.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RefreshToken} from "@modules/authentication/entities/refresh.token.entity";
import {LocalStrategy} from "@modules/authentication/stategy/local.strategy";
import {AuthRefreshTokenService} from "@modules/authentication/auth-refresh-token.service";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "@modules/authentication/stategy/jwt.strategy";
import {JwtModule} from "@nestjs/jwt";
import {JwtRefreshStrategy} from "@modules/authentication/stategy/jwt-refresh.strategy";

@Module({
  imports: [
      TypeOrmModule.forFeature([RefreshToken]),
      UserModule,
      PassportModule,
      JwtModule.register({})
  ],
  controllers: [AuthenticationController],
  providers: [
      AuthenticationService,
      LocalStrategy,
      JwtStrategy,
      JwtRefreshStrategy,
      AuthRefreshTokenService,
  ],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}
