import { z } from 'zod';

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  NGN = 'NGN',
  KES = 'KES',
  GHS = 'GHS',
  ZAR = 'ZAR',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
}

export enum LedgerEntryType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum PayrollJobStatus {
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PAUSED = 'PAUSED',
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

export const CreateAccountSchema = z.object({
  userId: z.string().uuid(),
  currency: z.nativeEnum(Currency),
  name: z.string().min(1).max(255),
  email: z.string().email(),
});

export const DisbursementSchema = z.object({
  idempotencyKey: z.string().min(1).max(255),
  sourceAccountId: z.string().uuid(),
  destinationAccountId: z.string().uuid(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format'),
  currency: z.nativeEnum(Currency),
  fxQuoteId: z.string().uuid().optional(),
});

export const FxQuoteRequestSchema = z.object({
  sourceCurrency: z.nativeEnum(Currency),
  targetCurrency: z.nativeEnum(Currency),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
});

export const PayrollSubmitSchema = z.object({
  employerAccountId: z.string().uuid(),
  currency: z.nativeEnum(Currency),
  items: z.array(z.object({
    employeeAccountId: z.string().uuid(),
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  })).min(1).max(50000),
});

export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;
export type DisbursementInput = z.infer<typeof DisbursementSchema>;
export type FxQuoteRequest = z.infer<typeof FxQuoteRequestSchema>;
export type PayrollSubmitInput = z.infer<typeof PayrollSubmitSchema>;
