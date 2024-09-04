import {Body, Controller, InternalServerErrorException, Post, UseGuards} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import{Request} from '@nestjs/common';
import { Response ,Request as ExpressRequest } from 'express';
import {SignUpDto} from "@modules/authentication/dto/sign-up.dto";
import {LocalAuthGuard} from "@modules/authentication/guard/local-auth.guard";
import {AuthRefreshTokenService} from "@modules/authentication/auth-refresh-token.service";
import {Throttle} from "@nestjs/throttler";
import {ApiBearerAuth} from "@nestjs/swagger";
import {Public} from "../../decorators/pulic.decorator";
import {JwtRefreshAuthGuard} from "@modules/authentication/guard/jwt-refresh-auth.guard";

@Controller('auth')
export class AuthenticationController {
  constructor(
      private readonly authenticationService: AuthenticationService,
      private readonly authRefreshTokenService: AuthRefreshTokenService,
      ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: any) {
    const { user } = req;
    return this.authenticationService.login(user.id.toString())
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authenticationService.signUp(signUpDto)
  }

  @Throttle({
    short: { limit: 1, ttl: 1000 },
    long: { limit: 2, ttl: 60000 },
  })
  @ApiBearerAuth()
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  refreshTokens(@Request() req: ExpressRequest){
    if(!req.user){
      throw new InternalServerErrorException();
    }

    return this.authRefreshTokenService.generateTokenPair(
        (req.user as any).attributes.id,
        req.headers.authorization?.split(' ')[1],
        (req.user as any).refreshTokenExpiresAt,
    )

  }

}
