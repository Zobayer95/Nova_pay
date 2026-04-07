import pino from 'pino';
export interface LogContext {
    requestId?: string;
    userId?: string;
    transactionId?: string;
    service?: string;
}
export declare function createLogger(service: string): pino.Logger;
export declare function childLogger(logger: pino.Logger, context: LogContext): pino.Logger;
//# sourceMappingURL=logger.d.ts.map