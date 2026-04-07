"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = createLogger;
exports.childLogger = childLogger;
const pino_1 = __importDefault(require("pino"));
function createLogger(service) {
    return (0, pino_1.default)({
        name: service,
        level: process.env['LOG_LEVEL'] ?? 'info',
        timestamp: pino_1.default.stdTimeFunctions.isoTime,
        formatters: {
            level(label) {
                return { level: label };
            },
        },
        redact: {
            paths: [
                'email',
                'name',
                'encryptedName',
                'encryptedEmail',
                'password',
                'token',
                'authorization',
            ],
            censor: '[REDACTED]',
        },
    });
}
function childLogger(logger, context) {
    return logger.child(context);
}
//# sourceMappingURL=logger.js.map