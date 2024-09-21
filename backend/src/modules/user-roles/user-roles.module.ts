import { Module } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { UserRolesController } from './user-roles.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserRoles} from "@modules/user-roles/entities/user-roles.entities";
import {UserRolesRepository} from "@repositories/user-roles.repository";

@Module({
  imports: [TypeOrmModule.forFeature([UserRoles])],
  controllers: [UserRolesController],
  providers: [UserRolesService,
      {
        provide: 'UserRoleRepositoryInterface',
        useClass: UserRolesRepository
      }
    ],
  exports: [UserRolesService, TypeOrmModule.forFeature([UserRoles])],
})
export class UserRolesModule {}
