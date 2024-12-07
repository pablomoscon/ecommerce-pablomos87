import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';


/* @Injectable()
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

    const credentialsBase64 = authFormat[1];
    const decodedCredential = Buffer.from(credentialsBase64, 'base64').toString('utf-8');

    console.log(decodedCredential);
    
    return true;
  }
} */

  @Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }
  }
  
  async canActivate(
    context: ExecutionContext,   

  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();   

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found')
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, { 
        secret: process.env.JWT_SECRET,
      });
      payload.iat = new Date(payload.iat * 1000);
      payload.exp = new Date(payload.exp * 1000);
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }
    return true;
  };

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}