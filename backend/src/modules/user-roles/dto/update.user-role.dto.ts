import {PartialType} from "@nestjs/swagger";
import {CreateUserRolesDto} from "@modules/user-roles/dto/create.user-roles.dto";

export class UpdateUserRoleDto extends PartialType(CreateUserRolesDto) {}