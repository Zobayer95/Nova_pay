interface RecoveryResult {
    transactionId: string;
    action: 'completed' | 'reversed' | 'failed';
    error?: string;
}
export declare function scanStalledTransactions(): Promise<string[]>;
export declare function recoverTransaction(id: string): Promise<RecoveryResult>;
export declare function runRecoveryCycle(): Promise<RecoveryResult[]>;
export {};
//# sourceMappingURL=recovery.d.ts.map