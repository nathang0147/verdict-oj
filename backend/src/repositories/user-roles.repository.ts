import {Injectable} from "@nestjs/common";
import {UserRolesRepositoryInterface} from "@modules/user-roles/interfaces/user-roles.interface";
import {UserRoles} from "@modules/user-roles/entities/user-roles.entities";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {BaseRepositoryAbstract} from "@repositories/base/base.abstract.repository";

@Injectable()
export class UserRolesRepository
    extends BaseRepositoryAbstract<UserRoles>
    implements UserRolesRepositoryInterface
{
    constructor(
        @InjectRepository(UserRoles)
        private readonly userRolesRepository: Repository<UserRoles>
    ) {
        super(userRolesRepository);
    }
}