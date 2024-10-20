import { NextFunction } from "express";


export function loggerGloblal(req: Request, res: Response, next: NextFunction){
    console.log(`Estás ejecutando un método ${req.method} en la ruta ${req.url} a las ${new Date().toISOString()}`);
    next();
}