export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_KEY = 'DUPLICATE_KEY',
  IDEMPOTENCY_CONFLICT = 'IDEMPOTENCY_CONFLICT',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  FX_QUOTE_EXPIRED = 'FX_QUOTE_EXPIRED',
  FX_QUOTE_USED = 'FX_QUOTE_USED',
  FX_PROVIDER_UNAVAILABLE = 'FX_PROVIDER_UNAVAILABLE',
  LEDGER_INVARIANT_VIOLATION = 'LEDGER_INVARIANT_VIOLATION',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  CONCURRENT_MODIFICATION = 'CONCURRENT_MODIFICATION',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(ErrorCode.NOT_FOUND, `${resource} not found: ${id}`, 404);
  }
}

export class InsufficientBalanceError extends AppError {
  constructor(accountId: string) {
    super(
      ErrorCode.INSUFFICIENT_BALANCE,
      `Insufficient balance for account: ${accountId}`,
      422,
    );
  }
}

export class IdempotencyConflictError extends AppError {
  constructor(key: string) {
    super(
      ErrorCode.IDEMPOTENCY_CONFLICT,
      `Idempotency key payload mismatch: ${key}`,
      409,
    );
  }
}

export class FxQuoteExpiredError extends AppError {
  constructor(quoteId: string) {
    super(ErrorCode.FX_QUOTE_EXPIRED, `FX quote expired: ${quoteId}`, 422);
  }
}

export class LedgerInvariantViolation extends AppError {
  constructor(details: string) {
    super(
      ErrorCode.LEDGER_INVARIANT_VIOLATION,
      `Ledger invariant violation: ${details}`,
      500,
    );
  }
}
