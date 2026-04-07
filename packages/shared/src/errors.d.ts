export declare enum ErrorCode {
    VALIDATION_ERROR = "VALIDATION_ERROR",
    NOT_FOUND = "NOT_FOUND",
    DUPLICATE_KEY = "DUPLICATE_KEY",
    IDEMPOTENCY_CONFLICT = "IDEMPOTENCY_CONFLICT",
    INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",
    FX_QUOTE_EXPIRED = "FX_QUOTE_EXPIRED",
    FX_QUOTE_USED = "FX_QUOTE_USED",
    FX_PROVIDER_UNAVAILABLE = "FX_PROVIDER_UNAVAILABLE",
    LEDGER_INVARIANT_VIOLATION = "LEDGER_INVARIANT_VIOLATION",
    TRANSACTION_FAILED = "TRANSACTION_FAILED",
    CONCURRENT_MODIFICATION = "CONCURRENT_MODIFICATION",
    INTERNAL_ERROR = "INTERNAL_ERROR",
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"
}
export declare class AppError extends Error {
    readonly code: ErrorCode;
    readonly statusCode: number;
    constructor(code: ErrorCode, message: string, statusCode?: number);
}
export declare class NotFoundError extends AppError {
    constructor(resource: string, id: string);
}
export declare class InsufficientBalanceError extends AppError {
    constructor(accountId: string);
}
export declare class IdempotencyConflictError extends AppError {
    constructor(key: string);
}
export declare class FxQuoteExpiredError extends AppError {
    constructor(quoteId: string);
}
export declare class LedgerInvariantViolation extends AppError {
    constructor(details: string);
}
//# sourceMappingURL=errors.d.ts.map