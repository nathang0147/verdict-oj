import {Inject, Injectable} from '@nestjs/common';
import {BaseServiceAbstract} from "../../services/base/base.abstract.service";
import {UserRoles} from "@modules/user-roles/entities/user-roles.entities";
import {UserRolesRepositoryInterface} from "@modules/user-roles/interfaces/user-roles.interface";

@Injectable()
export class UserRolesService extends BaseServiceAbstract<UserRoles>{
    constructor(
        @Inject('UserRoleRepositoryInterface')
        private readonly userRolesRepository: UserRolesRepositoryInterface,
    ) {
        super(userRolesRepository);
    }
}
