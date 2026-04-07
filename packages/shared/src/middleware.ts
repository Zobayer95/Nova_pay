import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ZodSchema, ZodError } from 'zod';
import { createLogger } from './logger';
import { AppError, ErrorCode } from './errors';
import { Counter, Histogram } from 'prom-client';

const logger = createLogger('middleware');

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      userId?: string;
    }
  }
}

export function requestIdMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  req.requestId = (req.headers['x-request-id'] as string) ?? uuidv4();
  next();
}

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      requestId: req.requestId,
      userId: req.userId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
    });
  });
  next();
}

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          error: ErrorCode.VALIDATION_ERROR,
          message: 'Validation failed',
          details: err.errors,
          requestId: req.requestId,
        });
        return;
      }
      next(err);
    }
  };
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error({
    requestId: req.requestId,
    userId: req.userId,
    error: err.message,
    stack: err.stack,
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
      requestId: req.requestId,
    });
    return;
  }

  res.status(500).json({
    error: ErrorCode.INTERNAL_ERROR,
    message: 'Internal server error',
    requestId: req.requestId,
  });
}

export function createMetricsMiddleware(serviceName: string) {
  const httpRequestsTotal = new Counter({
    name: `${serviceName}_http_requests_total`,
    help: 'Total HTTP requests',
    labelNames: ['method', 'path', 'status'] as const,
  });

  const httpRequestDuration = new Histogram({
    name: `${serviceName}_http_request_duration_seconds`,
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'path'] as const,
    buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  });

  return (req: Request, res: Response, next: NextFunction): void => {
    const end = httpRequestDuration.startTimer({
      method: req.method,
      path: req.route?.path ?? req.path,
    });

    res.on('finish', () => {
      httpRequestsTotal.inc({
        method: req.method,
        path: req.route?.path ?? req.path,
        status: res.statusCode.toString(),
      });
      end();
    });

    next();
  };
}
