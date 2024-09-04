import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import Role from "@modules/authorization/contrants/role.enum";
import {ROLES_KEY} from "../../../decorators/roles.decorator";
import {IS_PUBLIC_KEY} from "../../../decorators/pulic.decorator";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private reflector: Reflector) {}


    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles || isPublic) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some((role) => user?.role === role);
    }
}