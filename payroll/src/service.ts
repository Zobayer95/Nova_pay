import { PayrollSubmitInput, NotFoundError } from '@novapay/shared';
import { Prisma } from '../generated/prisma';
import prisma from './repository';
import { payrollQueue } from './queue';
import { PayrollJobStatus, PayrollItemStatus } from '../generated/prisma';
import { v4 as uuidv4 } from 'uuid';

type TransactionClient = Prisma.TransactionClient;

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class PayrollService {
  async submitJob(input: PayrollSubmitInput): Promise<{ id: string; status: string }> {
    const jobId = uuidv4();

    const job = await prisma.$transaction(async (tx: TransactionClient) => {
      const payrollJob = await tx.payrollJob.create({
        data: {
          id: jobId,
          employerAccountId: input.employerAccountId,
          status: PayrollJobStatus.QUEUED,
          totalItems: input.items.length,
        },
      });

      const itemsData = input.items.map((item) => ({
        id: uuidv4(),
        jobId,
        employeeAccountId: item.employeeAccountId,
        amount: item.amount,
        currency: input.currency,
        status: PayrollItemStatus.PENDING,
      }));

      await tx.payrollItem.createMany({ data: itemsData });

      return payrollJob;
    });

    await payrollQueue.add('process-payroll', {
      jobId: job.id,
      employerAccountId: input.employerAccountId,
    });

    return { id: job.id, status: job.status };
  }

  async getJobStatus(jobId: string): Promise<{
    id: string;
    employerAccountId: string;
    status: string;
    totalItems: number;
    processedItems: number;
    failedItems: number;
    checkpoint: number;
    createdAt: Date;
    updatedAt: Date;
  }> {
    const job = await prisma.payrollJob.findUnique({ where: { id: jobId } });

    if (!job) {
      throw new NotFoundError('PayrollJob', jobId);
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

  async getJobItems(
    jobId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<PaginatedResult<{
    id: string;
    jobId: string;
    employeeAccountId: string;
    amount: string;
    currency: string;
    status: string;
    transactionId: string | null;
    error: string | null;
    createdAt: Date;
  }>> {
    const job = await prisma.payrollJob.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundError('PayrollJob', jobId);
    }

    const offset = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.payrollItem.findMany({
        where: { jobId },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'asc' },
      }),
      prisma.payrollItem.count({ where: { jobId } }),
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

  async pauseJob(jobId: string): Promise<{ id: string; status: string }> {
    const job = await prisma.payrollJob.findUnique({ where: { id: jobId } });

    if (!job) {
      throw new NotFoundError('PayrollJob', jobId);
    }

    if (job.status !== PayrollJobStatus.PROCESSING && job.status !== PayrollJobStatus.QUEUED) {
      throw new Error(`Cannot pause job with status: ${job.status}`);
    }

    const updated = await prisma.payrollJob.update({
      where: { id: jobId },
      data: { status: PayrollJobStatus.PAUSED },
    });

    return { id: updated.id, status: updated.status };
  }

  async resumeJob(jobId: string): Promise<{ id: string; status: string }> {
    const job = await prisma.payrollJob.findUnique({ where: { id: jobId } });

    if (!job) {
      throw new NotFoundError('PayrollJob', jobId);
    }

    if (job.status !== PayrollJobStatus.PAUSED) {
      throw new Error(`Cannot resume job with status: ${job.status}`);
    }

    const updated = await prisma.payrollJob.update({
      where: { id: jobId },
      data: { status: PayrollJobStatus.QUEUED },
    });

    await payrollQueue.add('process-payroll', {
      jobId: updated.id,
      employerAccountId: updated.employerAccountId,
    });

    return { id: updated.id, status: updated.status };
  }
}

export const payrollService = new PayrollService();
