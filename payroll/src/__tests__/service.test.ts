/* eslint-disable @typescript-eslint/no-explicit-any */

const PayrollJobStatus = {
  QUEUED: 'QUEUED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  PAUSED: 'PAUSED',
} as const;

const PayrollItemStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

jest.mock('@prisma/client', () => ({
  PayrollJobStatus,
  PayrollItemStatus,
  Prisma: {},
}));

const mockPrismaInner = {
  payrollJob: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
  },
  payrollItem: {
    createMany: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
};

const mockPrisma = {
  ...mockPrismaInner,
  $transaction: jest.fn(),
};

jest.mock('../repository', () => ({
  __esModule: true,
  default: mockPrisma,
}));

const mockPayrollQueue = {
  add: jest.fn(),
};

jest.mock('../queue', () => ({
  payrollQueue: mockPayrollQueue,
  QUEUE_NAME: 'payroll-processing',
  createRedisConnection: jest.fn(),
}));

import { Currency } from '@novapay/shared';
import { PayrollService } from '../service';

describe('PayrollService', () => {
  let service: PayrollService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PayrollService();
  });

  describe('submitJob', () => {
    it('creates job and items, adds to queue', async () => {
      const input = {
        employerAccountId: '11111111-1111-1111-1111-111111111111',
        currency: Currency.USD,
        items: [
          { employeeAccountId: '22222222-2222-2222-2222-222222222222', amount: '1000.00' },
          { employeeAccountId: '33333333-3333-3333-3333-333333333333', amount: '2000.00' },
        ],
      };

      const createdJob = {
        id: 'job-1',
        employerAccountId: input.employerAccountId,
        status: PayrollJobStatus.QUEUED,
        totalItems: 2,
        processedItems: 0,
        failedItems: 0,
        checkpoint: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // $transaction receives a callback; we invoke it with a mock tx client
      mockPrisma.$transaction.mockImplementation(async (cb: (tx: any) => Promise<any>) => {
        const txClient = {
          payrollJob: { create: jest.fn().mockResolvedValue(createdJob) },
          payrollItem: { createMany: jest.fn().mockResolvedValue({ count: 2 }) },
        };
        return cb(txClient);
      });

      mockPayrollQueue.add.mockResolvedValue({});

      const result = await service.submitJob(input);

      expect(result.id).toBe('job-1');
      expect(result.status).toBe(PayrollJobStatus.QUEUED);
      expect(mockPayrollQueue.add).toHaveBeenCalledWith('process-payroll', {
        jobId: 'job-1',
        employerAccountId: input.employerAccountId,
      });
    });
  });

  describe('getJobStatus', () => {
    it('returns job with stats', async () => {
      const job = {
        id: 'job-status-1',
        employerAccountId: '11111111-1111-1111-1111-111111111111',
        status: PayrollJobStatus.PROCESSING,
        totalItems: 10,
        processedItems: 5,
        failedItems: 1,
        checkpoint: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.payrollJob.findUnique.mockResolvedValue(job);

      const result = await service.getJobStatus('job-status-1');

      expect(result.id).toBe('job-status-1');
      expect(result.status).toBe(PayrollJobStatus.PROCESSING);
      expect(result.totalItems).toBe(10);
      expect(result.processedItems).toBe(5);
      expect(result.failedItems).toBe(1);
      expect(result.checkpoint).toBe(5);
    });

    it('throws NotFoundError for missing job', async () => {
      mockPrisma.payrollJob.findUnique.mockResolvedValue(null);

      await expect(service.getJobStatus('nonexistent')).rejects.toMatchObject({
        code: 'NOT_FOUND',
        statusCode: 404,
      });
    });
  });

  describe('getJobItems', () => {
    it('returns paginated items', async () => {
      const job = {
        id: 'job-items-1',
        employerAccountId: '11111111-1111-1111-1111-111111111111',
        status: PayrollJobStatus.PROCESSING,
        totalItems: 3,
        processedItems: 2,
        failedItems: 0,
        checkpoint: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const items = [
        {
          id: 'item-1',
          jobId: 'job-items-1',
          employeeAccountId: '22222222-2222-2222-2222-222222222222',
          amount: { toString: () => '1000.00' },
          currency: 'USD',
          status: PayrollItemStatus.COMPLETED,
          transactionId: 'tx-1',
          error: null,
          createdAt: new Date(),
        },
        {
          id: 'item-2',
          jobId: 'job-items-1',
          employeeAccountId: '33333333-3333-3333-3333-333333333333',
          amount: { toString: () => '2000.00' },
          currency: 'USD',
          status: PayrollItemStatus.PENDING,
          transactionId: null,
          error: null,
          createdAt: new Date(),
        },
      ];

      mockPrisma.payrollJob.findUnique.mockResolvedValue(job);
      mockPrisma.payrollItem.findMany.mockResolvedValue(items);
      mockPrisma.payrollItem.count.mockResolvedValue(2);

      const result = await service.getJobItems('job-items-1', 1, 50);

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(50);
      expect(result.totalPages).toBe(1);
      expect(result.data[0]!.amount).toBe('1000.00');
    });
  });

  describe('pauseJob', () => {
    it('updates job status to PAUSED', async () => {
      const job = {
        id: 'job-pause-1',
        employerAccountId: '11111111-1111-1111-1111-111111111111',
        status: PayrollJobStatus.PROCESSING,
        totalItems: 10,
        processedItems: 3,
        failedItems: 0,
        checkpoint: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.payrollJob.findUnique.mockResolvedValue(job);
      mockPrisma.payrollJob.update.mockResolvedValue({
        ...job,
        status: PayrollJobStatus.PAUSED,
      });

      const result = await service.pauseJob('job-pause-1');

      expect(result.status).toBe(PayrollJobStatus.PAUSED);
      expect(mockPrisma.payrollJob.update).toHaveBeenCalledWith({
        where: { id: 'job-pause-1' },
        data: { status: PayrollJobStatus.PAUSED },
      });
    });
  });

  describe('resumeJob', () => {
    it('re-queues paused job', async () => {
      const job = {
        id: 'job-resume-1',
        employerAccountId: '11111111-1111-1111-1111-111111111111',
        status: PayrollJobStatus.PAUSED,
        totalItems: 10,
        processedItems: 3,
        failedItems: 0,
        checkpoint: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedJob = {
        ...job,
        status: PayrollJobStatus.QUEUED,
      };

      mockPrisma.payrollJob.findUnique.mockResolvedValue(job);
      mockPrisma.payrollJob.update.mockResolvedValue(updatedJob);
      mockPayrollQueue.add.mockResolvedValue({});

      const result = await service.resumeJob('job-resume-1');

      expect(result.status).toBe(PayrollJobStatus.QUEUED);
      expect(mockPayrollQueue.add).toHaveBeenCalledWith('process-payroll', {
        jobId: 'job-resume-1',
        employerAccountId: job.employerAccountId,
      });
    });
  });
});
