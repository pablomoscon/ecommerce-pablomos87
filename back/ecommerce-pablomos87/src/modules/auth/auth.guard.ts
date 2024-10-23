import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

function validateRequest(request: Request) {
    const authHeader = request.headers['authorization'];
    if (!authHeader) { return false; } 
    
    const [authType, authData] = authHeader.split(': ');

    if (authType !== 'Basic' || !authData) {
        return false;
    }
    const [email, password] = authData.split(':'); 

    console.log('Email:', email);
    console.log('Password:', password);

    if (!email || !password) {
        console.log('Email or password is missing');
        return false;
    }

    console.log('Authorization successful');
    return true;

        return true;
}

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return validateRequest(request);
    }
}