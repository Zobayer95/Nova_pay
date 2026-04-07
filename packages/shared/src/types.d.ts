import { z } from 'zod';
export declare enum Currency {
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    NGN = "NGN",
    KES = "KES",
    GHS = "GHS",
    ZAR = "ZAR"
}
export declare enum TransactionStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REVERSED = "REVERSED"
}
export declare enum LedgerEntryType {
    DEBIT = "DEBIT",
    CREDIT = "CREDIT"
}
export declare enum PayrollJobStatus {
    QUEUED = "QUEUED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    PAUSED = "PAUSED"
}
export interface Account {
    id: string;
    userId: string;
    currency: Currency;
    balance: string;
    encryptedName: string;
    encryptedEmail: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface LedgerEntry {
    id: string;
    transactionId: string;
    accountId: string;
    type: LedgerEntryType;
    amount: string;
    currency: Currency;
    balanceBefore: string;
    balanceAfter: string;
    hashChain: string;
    createdAt: Date;
}
export interface Transaction {
    id: string;
    idempotencyKey: string;
    sourceAccountId: string;
    destinationAccountId: string;
    amount: string;
    currency: Currency;
    fxQuoteId: string | null;
    status: TransactionStatus;
    payloadHash: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface FxQuote {
    id: string;
    sourceCurrency: Currency;
    targetCurrency: Currency;
    rate: string;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
}
export interface PayrollJob {
    id: string;
    employerAccountId: string;
    status: PayrollJobStatus;
    totalItems: number;
    processedItems: number;
    failedItems: number;
    checkpoint: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface PayrollItem {
    id: string;
    jobId: string;
    employeeAccountId: string;
    amount: string;
    currency: Currency;
    status: TransactionStatus;
    transactionId: string | null;
    error: string | null;
}
export declare const CreateAccountSchema: z.ZodObject<{
    userId: z.ZodString;
    currency: z.ZodNativeEnum<typeof Currency>;
    name: z.ZodString;
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
    currency: Currency;
    name: string;
    email: string;
}, {
    userId: string;
    currency: Currency;
    name: string;
    email: string;
}>;
export declare const DisbursementSchema: z.ZodObject<{
    idempotencyKey: z.ZodString;
    sourceAccountId: z.ZodString;
    destinationAccountId: z.ZodString;
    amount: z.ZodString;
    currency: z.ZodNativeEnum<typeof Currency>;
    fxQuoteId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    currency: Currency;
    idempotencyKey: string;
    sourceAccountId: string;
    destinationAccountId: string;
    amount: string;
    fxQuoteId?: string | undefined;
}, {
    currency: Currency;
    idempotencyKey: string;
    sourceAccountId: string;
    destinationAccountId: string;
    amount: string;
    fxQuoteId?: string | undefined;
}>;
export declare const FxQuoteRequestSchema: z.ZodObject<{
    sourceCurrency: z.ZodNativeEnum<typeof Currency>;
    targetCurrency: z.ZodNativeEnum<typeof Currency>;
    amount: z.ZodString;
}, "strip", z.ZodTypeAny, {
    amount: string;
    sourceCurrency: Currency;
    targetCurrency: Currency;
}, {
    amount: string;
    sourceCurrency: Currency;
    targetCurrency: Currency;
}>;
export declare const PayrollSubmitSchema: z.ZodObject<{
    employerAccountId: z.ZodString;
    currency: z.ZodNativeEnum<typeof Currency>;
    items: z.ZodArray<z.ZodObject<{
        employeeAccountId: z.ZodString;
        amount: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        amount: string;
        employeeAccountId: string;
    }, {
        amount: string;
        employeeAccountId: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    currency: Currency;
    employerAccountId: string;
    items: {
        amount: string;
        employeeAccountId: string;
    }[];
}, {
    currency: Currency;
    employerAccountId: string;
    items: {
        amount: string;
        employeeAccountId: string;
    }[];
}>;
export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;
export type DisbursementInput = z.infer<typeof DisbursementSchema>;
export type FxQuoteRequest = z.infer<typeof FxQuoteRequestSchema>;
export type PayrollSubmitInput = z.infer<typeof PayrollSubmitSchema>;
//# sourceMappingURL=types.d.ts.map