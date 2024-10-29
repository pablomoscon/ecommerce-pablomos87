import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const
      authHeader = request.header('Authorization');


    if (!authHeader) {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    const authFormat = authHeader.split(' ');
    console.log(authHeader);
    console.log(authFormat);

    return true;
  }
}