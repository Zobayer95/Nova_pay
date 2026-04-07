import pino from 'pino';

export interface LogContext {
  requestId?: string;
  userId?: string;
  transactionId?: string;
  service?: string;
}

export function createLogger(service: string): pino.Logger {
  return pino({
    name: service,
    level: process.env['LOG_LEVEL'] ?? 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level(label: string) {
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

export function childLogger(
  logger: pino.Logger,
  context: LogContext,
): pino.Logger {
  return logger.child(context);
}
