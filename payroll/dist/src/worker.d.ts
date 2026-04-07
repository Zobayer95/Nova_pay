import { Worker } from 'bullmq';
interface PayrollJobData {
    jobId: string;
    employerAccountId: string;
}
export declare function startWorker(): Worker<PayrollJobData>;
export {};
//# sourceMappingURL=worker.d.ts.map