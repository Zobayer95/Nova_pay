interface ServiceHealthStatus {
    service: string;
    status: 'ok' | 'error';
    responseTimeMs: number;
    error?: string;
}
interface AggregatedHealthStatus {
    status: 'ok' | 'degraded' | 'down';
    services: ServiceHealthStatus[];
    timestamp: string;
}
interface LedgerInvariantResult {
    valid: boolean;
    details: unknown;
}
interface StalledTransaction {
    id: string;
    status: string;
    stalledSince: string;
    [key: string]: unknown;
}
interface RecoveryResult {
    transactionId: string;
    status: string;
    [key: string]: unknown;
}
interface PayrollJobSummary {
    id: string;
    status: string;
    totalItems: number;
    processedItems: number;
    failedItems: number;
    [key: string]: unknown;
}
export declare class AdminService {
    private readonly httpClient;
    private readonly serviceEndpoints;
    private readonly ledgerServiceUrl;
    private readonly transactionServiceUrl;
    private readonly payrollServiceUrl;
    constructor();
    checkAllHealth(): Promise<AggregatedHealthStatus>;
    checkLedgerInvariant(): Promise<LedgerInvariantResult>;
    getStalledTransactions(): Promise<StalledTransaction[]>;
    recoverTransaction(id: string): Promise<RecoveryResult>;
    getPayrollJobs(): Promise<PayrollJobSummary[]>;
}
export declare const adminService: AdminService;
export {};
//# sourceMappingURL=service.d.ts.map