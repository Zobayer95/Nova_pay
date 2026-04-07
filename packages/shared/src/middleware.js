"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = requestIdMiddleware;
exports.requestLogger = requestLogger;
exports.validateBody = validateBody;
exports.errorHandler = errorHandler;
exports.createMetricsMiddleware = createMetricsMiddleware;
const uuid_1 = require("uuid");
const zod_1 = require("zod");
const logger_1 = require("./logger");
const errors_1 = require("./errors");
const prom_client_1 = require("prom-client");
const logger = (0, logger_1.createLogger)('middleware');
function requestIdMiddleware(req, _res, next) {
    req.requestId = req.headers['x-request-id'] ?? (0, uuid_1.v4)();
    next();
}
function requestLogger(req, res, next) {
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
function validateBody(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                res.status(400).json({
                    error: errors_1.ErrorCode.VALIDATION_ERROR,
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
function errorHandler(err, req, res, _next) {
    logger.error({
        requestId: req.requestId,
        userId: req.userId,
        error: err.message,
        stack: err.stack,
    });
    if (err instanceof errors_1.AppError) {
        res.status(err.statusCode).json({
            error: err.code,
            message: err.message,
            requestId: req.requestId,
        });
        return;
    }
    res.status(500).json({
        error: errors_1.ErrorCode.INTERNAL_ERROR,
        message: 'Internal server error',
        requestId: req.requestId,
    });
}
function createMetricsMiddleware(serviceName) {
    const httpRequestsTotal = new prom_client_1.Counter({
        name: `${serviceName}_http_requests_total`,
        help: 'Total HTTP requests',
        labelNames: ['method', 'path', 'status'],
    });
    const httpRequestDuration = new prom_client_1.Histogram({
        name: `${serviceName}_http_request_duration_seconds`,
        help: 'HTTP request duration in seconds',
        labelNames: ['method', 'path'],
        buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    });
    return (req, res, next) => {
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
//# sourceMappingURL=middleware.js.map