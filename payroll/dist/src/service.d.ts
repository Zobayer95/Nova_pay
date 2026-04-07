import { PayrollSubmitInput } from '@novapay/shared';
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class PayrollService {
    submitJob(input: PayrollSubmitInput): Promise<{
        id: string;
        status: string;
    }>;
    getJobStatus(jobId: string): Promise<{
        id: string;
        employerAccountId: string;
        status: string;
        totalItems: number;
        processedItems: number;
        failedItems: number;
        checkpoint: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getJobItems(jobId: string, page?: number, limit?: number): Promise<PaginatedResult<{
        id: string;
        jobId: string;
        employeeAccountId: string;
        amount: string;
        currency: string;
        status: string;
        transactionId: string | null;
        error: string | null;
        createdAt: Date;
    }>>;
    pauseJob(jobId: string): Promise<{
        id: string;
        status: string;
    }>;
    resumeJob(jobId: string): Promise<{
        id: string;
        status: string;
    }>;
}
export declare const payrollService: PayrollService;
//# sourceMappingURL=service.d.ts.map