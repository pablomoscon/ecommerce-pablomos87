import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/modules/users/enum/roles.enum';
import * as request from 'supertest';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass()
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user
    const hasRole = () => requiredRoles.some((role) => user.administrator?.includes(role));
    const valid = user?.administrator && hasRole();
    if (!valid) {
      throw new UnauthorizedException (
        'You do not have permission and are not allowed to access to this route'
      )
    }
    return valid;
  }
}
