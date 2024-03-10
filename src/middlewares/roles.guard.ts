import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RoleEnum } from "src/entities/pengguna.entity";
import { ROLES_KEY } from "./roles.decorator";
import { AuthDto } from "src/dto/auth.dto";
import { AkunService } from "src/akun/akun.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private akunService: AkunService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const { id } = context.switchToHttp().getRequest().user as AuthDto;
    const user = await this.akunService.findById(id);

    if (!user) return false;

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
