"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerInvariantViolation = exports.FxQuoteExpiredError = exports.IdempotencyConflictError = exports.InsufficientBalanceError = exports.NotFoundError = exports.AppError = exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["DUPLICATE_KEY"] = "DUPLICATE_KEY";
    ErrorCode["IDEMPOTENCY_CONFLICT"] = "IDEMPOTENCY_CONFLICT";
    ErrorCode["INSUFFICIENT_BALANCE"] = "INSUFFICIENT_BALANCE";
    ErrorCode["FX_QUOTE_EXPIRED"] = "FX_QUOTE_EXPIRED";
    ErrorCode["FX_QUOTE_USED"] = "FX_QUOTE_USED";
    ErrorCode["FX_PROVIDER_UNAVAILABLE"] = "FX_PROVIDER_UNAVAILABLE";
    ErrorCode["LEDGER_INVARIANT_VIOLATION"] = "LEDGER_INVARIANT_VIOLATION";
    ErrorCode["TRANSACTION_FAILED"] = "TRANSACTION_FAILED";
    ErrorCode["CONCURRENT_MODIFICATION"] = "CONCURRENT_MODIFICATION";
    ErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    ErrorCode["SERVICE_UNAVAILABLE"] = "SERVICE_UNAVAILABLE";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
class AppError extends Error {
    code;
    statusCode;
    constructor(code, message, statusCode = 400) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(resource, id) {
        super(ErrorCode.NOT_FOUND, `${resource} not found: ${id}`, 404);
    }
}
exports.NotFoundError = NotFoundError;
class InsufficientBalanceError extends AppError {
    constructor(accountId) {
        super(ErrorCode.INSUFFICIENT_BALANCE, `Insufficient balance for account: ${accountId}`, 422);
    }
}
exports.InsufficientBalanceError = InsufficientBalanceError;
class IdempotencyConflictError extends AppError {
    constructor(key) {
        super(ErrorCode.IDEMPOTENCY_CONFLICT, `Idempotency key payload mismatch: ${key}`, 409);
    }
}
exports.IdempotencyConflictError = IdempotencyConflictError;
class FxQuoteExpiredError extends AppError {
    constructor(quoteId) {
        super(ErrorCode.FX_QUOTE_EXPIRED, `FX quote expired: ${quoteId}`, 422);
    }
}
exports.FxQuoteExpiredError = FxQuoteExpiredError;
class LedgerInvariantViolation extends AppError {
    constructor(details) {
        super(ErrorCode.LEDGER_INVARIANT_VIOLATION, `Ledger invariant violation: ${details}`, 500);
    }
}
exports.LedgerInvariantViolation = LedgerInvariantViolation;
//# sourceMappingURL=errors.js.map