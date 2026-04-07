"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollSubmitSchema = exports.FxQuoteRequestSchema = exports.DisbursementSchema = exports.CreateAccountSchema = exports.PayrollJobStatus = exports.LedgerEntryType = exports.TransactionStatus = exports.Currency = void 0;
const zod_1 = require("zod");
var Currency;
(function (Currency) {
    Currency["USD"] = "USD";
    Currency["EUR"] = "EUR";
    Currency["GBP"] = "GBP";
    Currency["NGN"] = "NGN";
    Currency["KES"] = "KES";
    Currency["GHS"] = "GHS";
    Currency["ZAR"] = "ZAR";
})(Currency || (exports.Currency = Currency = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["PROCESSING"] = "PROCESSING";
    TransactionStatus["COMPLETED"] = "COMPLETED";
    TransactionStatus["FAILED"] = "FAILED";
    TransactionStatus["REVERSED"] = "REVERSED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var LedgerEntryType;
(function (LedgerEntryType) {
    LedgerEntryType["DEBIT"] = "DEBIT";
    LedgerEntryType["CREDIT"] = "CREDIT";
})(LedgerEntryType || (exports.LedgerEntryType = LedgerEntryType = {}));
var PayrollJobStatus;
(function (PayrollJobStatus) {
    PayrollJobStatus["QUEUED"] = "QUEUED";
    PayrollJobStatus["PROCESSING"] = "PROCESSING";
    PayrollJobStatus["COMPLETED"] = "COMPLETED";
    PayrollJobStatus["FAILED"] = "FAILED";
    PayrollJobStatus["PAUSED"] = "PAUSED";
})(PayrollJobStatus || (exports.PayrollJobStatus = PayrollJobStatus = {}));
exports.CreateAccountSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    currency: zod_1.z.nativeEnum(Currency),
    name: zod_1.z.string().min(1).max(255),
    email: zod_1.z.string().email(),
});
exports.DisbursementSchema = zod_1.z.object({
    idempotencyKey: zod_1.z.string().min(1).max(255),
    sourceAccountId: zod_1.z.string().uuid(),
    destinationAccountId: zod_1.z.string().uuid(),
    amount: zod_1.z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format'),
    currency: zod_1.z.nativeEnum(Currency),
    fxQuoteId: zod_1.z.string().uuid().optional(),
});
exports.FxQuoteRequestSchema = zod_1.z.object({
    sourceCurrency: zod_1.z.nativeEnum(Currency),
    targetCurrency: zod_1.z.nativeEnum(Currency),
    amount: zod_1.z.string().regex(/^\d+(\.\d{1,2})?$/),
});
exports.PayrollSubmitSchema = zod_1.z.object({
    employerAccountId: zod_1.z.string().uuid(),
    currency: zod_1.z.nativeEnum(Currency),
    items: zod_1.z.array(zod_1.z.object({
        employeeAccountId: zod_1.z.string().uuid(),
        amount: zod_1.z.string().regex(/^\d+(\.\d{1,2})?$/),
    })).min(1).max(50000),
});
//# sourceMappingURL=types.js.map