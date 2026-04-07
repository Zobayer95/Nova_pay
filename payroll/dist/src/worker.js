"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWorker = startWorker;
const bullmq_1 = require("bullmq");
const axios_1 = __importDefault(require("axios"));
const shared_1 = require("@novapay/shared");
const repository_1 = __importDefault(require("./repository"));
const queue_1 = require("./queue");
const prisma_1 = require("../generated/prisma");
const prom_client_1 = require("prom-client");
const logger = (0, shared_1.createLogger)('payroll-worker');
const TRANSACTION_SERVICE_URL = process.env['TRANSACTION_SERVICE_URL'] ?? 'http://transaction-service:3002';
const payrollJobsTotal = new prom_client_1.Counter({
    name: 'payroll_jobs_total',
    help: 'Total number of payroll jobs processed',
    labelNames: ['status'],
});
const payrollItemsProcessedTotal = new prom_client_1.Counter({
    name: 'payroll_items_processed_total',
    help: 'Total number of payroll items processed',
    labelNames: ['status'],
});
const payrollJobDurationSeconds = new prom_client_1.Histogram({
    name: 'payroll_job_duration_seconds',
    help: 'Duration of payroll job processing in seconds',
    buckets: [1, 5, 10, 30, 60, 120, 300, 600],
});
async function acquireLock(connection, employerAccountId, ttlSeconds = 3600) {
    const lockKey = `payroll:lock:${employerAccountId}`;
    const result = await connection.set(lockKey, '1', 'EX', ttlSeconds, 'NX');
    return result === 'OK';
}
async function releaseLock(connection, employerAccountId) {
    const lockKey = `payroll:lock:${employerAccountId}`;
    await connection.del(lockKey);
}
async function processPayrollJob(job) {
    const { jobId, employerAccountId } = job.data;
    const connection = (0, queue_1.createRedisConnection)();
    const timer = payrollJobDurationSeconds.startTimer();
    let lockAcquired = false;
    try {
        lockAcquired = await acquireLock(connection, employerAccountId);
        if (!lockAcquired) {
            logger.info({ jobId, employerAccountId }, 'Could not acquire lock, will retry');
            throw new Error(`Lock not available for employer ${employerAccountId}`);
        }
        const payrollJob = await repository_1.default.payrollJob.findUnique({ where: { id: jobId } });
        if (!payrollJob) {
            logger.error({ jobId }, 'Payroll job not found');
            return;
        }
        if (payrollJob.status === prisma_1.PayrollJobStatus.PAUSED) {
            logger.info({ jobId }, 'Job is paused, skipping');
            return;
        }
        await repository_1.default.payrollJob.update({
            where: { id: jobId },
            data: { status: prisma_1.PayrollJobStatus.PROCESSING },
        });
        const items = await repository_1.default.payrollItem.findMany({
            where: { jobId },
            orderBy: { createdAt: 'asc' },
        });
        const startIndex = payrollJob.checkpoint;
        for (let i = startIndex; i < items.length; i++) {
            const currentJob = await repository_1.default.payrollJob.findUnique({ where: { id: jobId } });
            if (currentJob?.status === prisma_1.PayrollJobStatus.PAUSED) {
                logger.info({ jobId, checkpoint: i }, 'Job paused, saving checkpoint');
                return;
            }
            const item = items[i];
            if (!item || item.status === prisma_1.PayrollItemStatus.COMPLETED) {
                continue;
            }
            try {
                await repository_1.default.payrollItem.update({
                    where: { id: item.id },
                    data: { status: prisma_1.PayrollItemStatus.PROCESSING },
                });
                const response = await axios_1.default.post(`${TRANSACTION_SERVICE_URL}/disburse`, {
                    idempotencyKey: `payroll-${jobId}-${item.id}`,
                    sourceAccountId: employerAccountId,
                    destinationAccountId: item.employeeAccountId,
                    amount: item.amount.toString(),
                    currency: item.currency,
                });
                await repository_1.default.payrollItem.update({
                    where: { id: item.id },
                    data: {
                        status: prisma_1.PayrollItemStatus.COMPLETED,
                        transactionId: response.data.id,
                    },
                });
                await repository_1.default.payrollJob.update({
                    where: { id: jobId },
                    data: {
                        processedItems: { increment: 1 },
                        checkpoint: i + 1,
                    },
                });
                payrollItemsProcessedTotal.inc({ status: 'completed' });
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                logger.error({ jobId, itemId: item.id, error: errorMessage }, 'Failed to process item');
                await repository_1.default.payrollItem.update({
                    where: { id: item.id },
                    data: {
                        status: prisma_1.PayrollItemStatus.FAILED,
                        error: errorMessage,
                    },
                });
                await repository_1.default.payrollJob.update({
                    where: { id: jobId },
                    data: {
                        failedItems: { increment: 1 },
                        checkpoint: i + 1,
                    },
                });
                payrollItemsProcessedTotal.inc({ status: 'failed' });
            }
        }
        await repository_1.default.payrollJob.update({
            where: { id: jobId },
            data: { status: prisma_1.PayrollJobStatus.COMPLETED },
        });
        payrollJobsTotal.inc({ status: 'completed' });
        logger.info({ jobId }, 'Payroll job completed');
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        logger.error({ jobId, error: errorMessage }, 'Payroll job processing error');
        if (lockAcquired) {
            await repository_1.default.payrollJob.update({
                where: { id: jobId },
                data: { status: prisma_1.PayrollJobStatus.FAILED },
            });
            payrollJobsTotal.inc({ status: 'failed' });
        }
        throw err;
    }
    finally {
        timer();
        if (lockAcquired) {
            await releaseLock(connection, employerAccountId);
        }
        await connection.quit();
    }
}
function startWorker() {
    const connection = (0, queue_1.createRedisConnection)();
    const worker = new bullmq_1.Worker(queue_1.QUEUE_NAME, processPayrollJob, {
        connection,
        concurrency: 5,
    });
    worker.on('completed', (job) => {
        logger.info({ jobId: job.data.jobId }, 'Queue job completed');
    });
    worker.on('failed', (job, err) => {
        logger.error({ jobId: job?.data.jobId, error: err.message }, 'Queue job failed');
    });
    worker.on('error', (err) => {
        logger.error({ error: err.message }, 'Worker error');
    });
    logger.info('Payroll worker started');
    return worker;
}
//# sourceMappingURL=worker.js.map