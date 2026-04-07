"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payrollSubmitRateLimiter = exports.disburseRateLimiter = exports.sensitiveEndpointLimiter = exports.globalRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.globalRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'TOO_MANY_REQUESTS',
        message: 'Too many requests, please try again later',
    },
});
exports.sensitiveEndpointLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'TOO_MANY_REQUESTS',
        message: 'Rate limit exceeded for sensitive endpoint',
    },
});
exports.disburseRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'TOO_MANY_REQUESTS',
        message: 'Rate limit exceeded for disbursement endpoint',
    },
});
exports.payrollSubmitRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'TOO_MANY_REQUESTS',
        message: 'Rate limit exceeded for payroll submission endpoint',
    },
});
//# sourceMappingURL=rate-limiter.js.map