import { Worker, Job } from 'bullmq';
import axios from 'axios';
import { createLogger } from '@novapay/shared';
import prisma from './repository';
import { QUEUE_NAME, createRedisConnection } from './queue';
import { PayrollJobStatus, PayrollItemStatus } from '../generated/prisma';
import { Counter, Histogram } from 'prom-client';

const logger = createLogger('payroll-worker');

const TRANSACTION_SERVICE_URL =
  process.env['TRANSACTION_SERVICE_URL'] ?? 'http://transaction-service:3002';

const payrollJobsTotal = new Counter({
  name: 'payroll_jobs_total',
  help: 'Total number of payroll jobs processed',
  labelNames: ['status'] as const,
});

const payrollItemsProcessedTotal = new Counter({
  name: 'payroll_items_processed_total',
  help: 'Total number of payroll items processed',
  labelNames: ['status'] as const,
});

const payrollJobDurationSeconds = new Histogram({
  name: 'payroll_job_duration_seconds',
  help: 'Duration of payroll job processing in seconds',
  buckets: [1, 5, 10, 30, 60, 120, 300, 600],
});

interface PayrollJobData {
  jobId: string;
  employerAccountId: string;
}

async function acquireLock(
  connection: ReturnType<typeof createRedisConnection>,
  employerAccountId: string,
  ttlSeconds: number = 3600,
): Promise<boolean> {
  const lockKey = `payroll:lock:${employerAccountId}`;
  const result = await connection.set(lockKey, '1', 'EX', ttlSeconds, 'NX');
  return result === 'OK';
}

async function releaseLock(
  connection: ReturnType<typeof createRedisConnection>,
  employerAccountId: string,
): Promise<void> {
  const lockKey = `payroll:lock:${employerAccountId}`;
  await connection.del(lockKey);
}

async function processPayrollJob(job: Job<PayrollJobData>): Promise<void> {
  const { jobId, employerAccountId } = job.data;
  const connection = createRedisConnection();
  const timer = payrollJobDurationSeconds.startTimer();

  let lockAcquired = false;

  try {
    lockAcquired = await acquireLock(connection, employerAccountId);

    if (!lockAcquired) {
      logger.info({ jobId, employerAccountId }, 'Could not acquire lock, will retry');
      throw new Error(`Lock not available for employer ${employerAccountId}`);
    }

    const payrollJob = await prisma.payrollJob.findUnique({ where: { id: jobId } });

    if (!payrollJob) {
      logger.error({ jobId }, 'Payroll job not found');
      return;
    }

    if (payrollJob.status === PayrollJobStatus.PAUSED) {
      logger.info({ jobId }, 'Job is paused, skipping');
      return;
    }

    await prisma.payrollJob.update({
      where: { id: jobId },
      data: { status: PayrollJobStatus.PROCESSING },
    });

    const items = await prisma.payrollItem.findMany({
      where: { jobId },
      orderBy: { createdAt: 'asc' },
    });

    const startIndex = payrollJob.checkpoint;

    for (let i = startIndex; i < items.length; i++) {
      const currentJob = await prisma.payrollJob.findUnique({ where: { id: jobId } });
      if (currentJob?.status === PayrollJobStatus.PAUSED) {
        logger.info({ jobId, checkpoint: i }, 'Job paused, saving checkpoint');
        return;
      }

      const item = items[i];
      if (!item || item.status === PayrollItemStatus.COMPLETED) {
        continue;
      }

      try {
        await prisma.payrollItem.update({
          where: { id: item.id },
          data: { status: PayrollItemStatus.PROCESSING },
        });

        const response = await axios.post<{ id: string }>(
          `${TRANSACTION_SERVICE_URL}/disburse`,
          {
            idempotencyKey: `payroll-${jobId}-${item.id}`,
            sourceAccountId: employerAccountId,
            destinationAccountId: item.employeeAccountId,
            amount: item.amount.toString(),
            currency: item.currency,
          },
        );

        await prisma.payrollItem.update({
          where: { id: item.id },
          data: {
            status: PayrollItemStatus.COMPLETED,
            transactionId: response.data.id,
          },
        });

        await prisma.payrollJob.update({
          where: { id: jobId },
          data: {
            processedItems: { increment: 1 },
            checkpoint: i + 1,
          },
        });

        payrollItemsProcessedTotal.inc({ status: 'completed' });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        logger.error({ jobId, itemId: item.id, error: errorMessage }, 'Failed to process item');

        await prisma.payrollItem.update({
          where: { id: item.id },
          data: {
            status: PayrollItemStatus.FAILED,
            error: errorMessage,
          },
        });

        await prisma.payrollJob.update({
          where: { id: jobId },
          data: {
            failedItems: { increment: 1 },
            checkpoint: i + 1,
          },
        });

        payrollItemsProcessedTotal.inc({ status: 'failed' });
      }
    }

    await prisma.payrollJob.update({
      where: { id: jobId },
      data: { status: PayrollJobStatus.COMPLETED },
    });

    payrollJobsTotal.inc({ status: 'completed' });
    logger.info({ jobId }, 'Payroll job completed');
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    logger.error({ jobId, error: errorMessage }, 'Payroll job processing error');

    if (lockAcquired) {
      await prisma.payrollJob.update({
        where: { id: jobId },
        data: { status: PayrollJobStatus.FAILED },
      });
      payrollJobsTotal.inc({ status: 'failed' });
    }

    throw err;
  } finally {
    timer();
    if (lockAcquired) {
      await releaseLock(connection, employerAccountId);
    }
    await connection.quit();
  }
}

export function startWorker(): Worker<PayrollJobData> {
  const connection = createRedisConnection();

  const worker = new Worker<PayrollJobData>(QUEUE_NAME, processPayrollJob, {
    connection,
    concurrency: 5,
  });

  worker.on('completed', (job: Job<PayrollJobData>) => {
    logger.info({ jobId: job.data.jobId }, 'Queue job completed');
  });

  worker.on('failed', (job: Job<PayrollJobData> | undefined, err: Error) => {
    logger.error(
      { jobId: job?.data.jobId, error: err.message },
      'Queue job failed',
    );
  });

  worker.on('error', (err: Error) => {
    logger.error({ error: err.message }, 'Worker error');
  });

  logger.info('Payroll worker started');

  return worker;
}
