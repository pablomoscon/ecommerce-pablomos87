import { NextFunction } from 'express';

export function loggerGloblal(req: Request, res: Response, next: NextFunction) {
  console.log(
    `You are executing a ${req.method} method on the ${req.url} route at ${new Date().toISOString()}`
  );
  next();
}
