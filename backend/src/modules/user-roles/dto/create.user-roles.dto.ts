import {USER_ROLES} from "@modules/user-roles/entities/user-roles.entities";
import {IsEnum, IsNotEmpty, IsOptional, MinLength} from "class-validator";

export class CreateUserRolesDto {
    @IsNotEmpty()
    @IsEnum(USER_ROLES)
    name: USER_ROLES;

    @IsOptional()
    @MinLength(1)
    description: string;
}