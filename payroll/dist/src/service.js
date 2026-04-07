"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payrollService = exports.PayrollService = void 0;
const shared_1 = require("@novapay/shared");
const repository_1 = __importDefault(require("./repository"));
const queue_1 = require("./queue");
const prisma_1 = require("../generated/prisma");
const uuid_1 = require("uuid");
class PayrollService {
    async submitJob(input) {
        const jobId = (0, uuid_1.v4)();
        const job = await repository_1.default.$transaction(async (tx) => {
            const payrollJob = await tx.payrollJob.create({
                data: {
                    id: jobId,
                    employerAccountId: input.employerAccountId,
                    status: prisma_1.PayrollJobStatus.QUEUED,
                    totalItems: input.items.length,
                },
            });
            const itemsData = input.items.map((item) => ({
                id: (0, uuid_1.v4)(),
                jobId,
                employeeAccountId: item.employeeAccountId,
                amount: item.amount,
                currency: input.currency,
                status: prisma_1.PayrollItemStatus.PENDING,
            }));
            await tx.payrollItem.createMany({ data: itemsData });
            return payrollJob;
        });
        await queue_1.payrollQueue.add('process-payroll', {
            jobId: job.id,
            employerAccountId: input.employerAccountId,
        });
        return { id: job.id, status: job.status };
    }
    async getJobStatus(jobId) {
        const job = await repository_1.default.payrollJob.findUnique({ where: { id: jobId } });
        if (!job) {
            throw new shared_1.NotFoundError('PayrollJob', jobId);
        }
        return {
            id: job.id,
            employerAccountId: job.employerAccountId,
            status: job.status,
            totalItems: job.totalItems,
            processedItems: job.processedItems,
            failedItems: job.failedItems,
            checkpoint: job.checkpoint,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
        };
    }
    async getJobItems(jobId, page = 1, limit = 50) {
        const job = await repository_1.default.payrollJob.findUnique({ where: { id: jobId } });
        if (!job) {
            throw new shared_1.NotFoundError('PayrollJob', jobId);
        }
        const offset = (page - 1) * limit;
        const [items, total] = await Promise.all([
            repository_1.default.payrollItem.findMany({
                where: { jobId },
                skip: offset,
                take: limit,
                orderBy: { createdAt: 'asc' },
            }),
            repository_1.default.payrollItem.count({ where: { jobId } }),
        ]);
        return {
            data: items.map((item) => ({
                id: item.id,
                jobId: item.jobId,
                employeeAccountId: item.employeeAccountId,
                amount: item.amount.toString(),
                currency: item.currency,
                status: item.status,
                transactionId: item.transactionId,
                error: item.error,
                createdAt: item.createdAt,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async pauseJob(jobId) {
        const job = await repository_1.default.payrollJob.findUnique({ where: { id: jobId } });
        if (!job) {
            throw new shared_1.NotFoundError('PayrollJob', jobId);
        }
        if (job.status !== prisma_1.PayrollJobStatus.PROCESSING && job.status !== prisma_1.PayrollJobStatus.QUEUED) {
            throw new Error(`Cannot pause job with status: ${job.status}`);
        }
        const updated = await repository_1.default.payrollJob.update({
            where: { id: jobId },
            data: { status: prisma_1.PayrollJobStatus.PAUSED },
        });
        return { id: updated.id, status: updated.status };
    }
    async resumeJob(jobId) {
        const job = await repository_1.default.payrollJob.findUnique({ where: { id: jobId } });
        if (!job) {
            throw new shared_1.NotFoundError('PayrollJob', jobId);
        }
        if (job.status !== prisma_1.PayrollJobStatus.PAUSED) {
            throw new Error(`Cannot resume job with status: ${job.status}`);
        }
        const updated = await repository_1.default.payrollJob.update({
            where: { id: jobId },
            data: { status: prisma_1.PayrollJobStatus.QUEUED },
        });
        await queue_1.payrollQueue.add('process-payroll', {
            jobId: updated.id,
            employerAccountId: updated.employerAccountId,
        });
        return { id: updated.id, status: updated.status };
    }
}
exports.PayrollService = PayrollService;
exports.payrollService = new PayrollService();
//# sourceMappingURL=service.js.map