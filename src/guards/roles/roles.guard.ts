import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/modules/users/enum/roles.enum';

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

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    
    const hasRole = () => requiredRoles.some((role) => user.role?.includes(role));
    const valid = user?.role && hasRole();
    if (!valid) {
      throw new UnauthorizedException(
        'You do not have permission and are not allowed to access to this route'
      )
    }
    return valid;
  }
};
