import type { DisbursementInput } from '@novapay/shared';
interface DisbursementResponse {
    transaction: {
        id: string;
        idempotencyKey: string;
        sourceAccountId: string;
        destinationAccountId: string;
        amount: string;
        currency: string;
        fxQuoteId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    };
}
export declare class TransactionService {
    private readonly redis;
    constructor(redisUrl?: string);
    disburse(input: DisbursementInput): Promise<{
        statusCode: number;
        body: DisbursementResponse;
    }>;
    private processDisburse;
    getTransactionById(id: string): Promise<DisbursementResponse>;
    getTransactionByIdempotencyKey(idempotencyKey: string): Promise<DisbursementResponse>;
    reverseTransaction(id: string): Promise<DisbursementResponse>;
    getStalledTransactions(): Promise<DisbursementResponse[]>;
    disconnect(): Promise<void>;
}
export declare const transactionService: TransactionService;
export {};
//# sourceMappingURL=service.d.ts.map