import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
declare global {
    namespace Express {
        interface Request {
            requestId: string;
            userId?: string;
        }
    }
}
export declare function requestIdMiddleware(req: Request, _res: Response, next: NextFunction): void;
export declare function requestLogger(req: Request, res: Response, next: NextFunction): void;
export declare function validateBody(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => void;
export declare function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void;
export declare function createMetricsMiddleware(serviceName: string): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=middleware.d.ts.map