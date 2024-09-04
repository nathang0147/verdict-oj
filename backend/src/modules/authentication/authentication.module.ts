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

@Module({
  imports: [
      TypeOrmModule.forFeature([RefreshToken]),
      UserModule,
      PassportModule,

  ],
  controllers: [AuthenticationController],
  providers: [
      AuthenticationService,
      LocalStrategy,
      JwtStrategy,
      AuthRefreshTokenService,
  ],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}
