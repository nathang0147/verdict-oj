import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { AuthorizationController } from './authorization.controller';
import {RoleGuard} from "@modules/authorization/guard/role.guard";

@Module({
  controllers: [AuthorizationController],
  providers: [
      AuthorizationService,
      RoleGuard,
  ],
})
export class AuthorizationModule {}
