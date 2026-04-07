/* eslint-disable @typescript-eslint/no-explicit-any */

const TransactionStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REVERSED: 'REVERSED',
} as const;

jest.mock('../../generated/prisma', () => ({
  TransactionStatus,
  Prisma: {
    Decimal: jest.fn().mockImplementation((val: string) => ({ toString: () => val })),
  },
  PrismaClient: jest.fn(),
}));

const mockPrisma = {
  transaction: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  idempotencyRecord: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  $disconnect: jest.fn(),
};

jest.mock('../repository', () => ({
  prisma: mockPrisma,
}));

const mockRedisInstance = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  disconnect: jest.fn(),
};

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => mockRedisInstance);
});

jest.mock('axios');

jest.mock('prom-client', () => ({
  Counter: jest.fn().mockImplementation(() => ({ inc: jest.fn() })),
  Histogram: jest.fn().mockImplementation(() => ({
    startTimer: jest.fn().mockReturnValue(jest.fn()),
  })),
}));

import axios from 'axios';
import { Currency } from '@novapay/shared';
import { TransactionService } from '../service';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TransactionService', () => {
  let service: TransactionService;

  const validInput = {
    idempotencyKey: 'idem-key-1',
    sourceAccountId: '11111111-1111-1111-1111-111111111111',
    destinationAccountId: '22222222-2222-2222-2222-222222222222',
    amount: '100.00',
    currency: Currency.USD,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TransactionService('redis://localhost:6379');
  });

  describe('disburse', () => {
    it('returns 409 when Redis lock cannot be acquired (set returns null)', async () => {
      mockRedisInstance.set.mockResolvedValue(null);

      await expect(service.disburse(validInput)).rejects.toMatchObject({
        statusCode: 409,
      });

      expect(mockRedisInstance.set).toHaveBeenCalledWith(
        `lock:idempotency:${validInput.idempotencyKey}`,
        expect.any(String),
        'EX',
        30,
        'NX',
      );
    });

    it('returns cached response when idempotency record exists with matching hash', async () => {
      mockRedisInstance.set.mockResolvedValue('OK');
      mockRedisInstance.get.mockResolvedValue(expect.any(String));

      const cachedBody = {
        transaction: {
          id: 'tx-1',
          idempotencyKey: validInput.idempotencyKey,
          sourceAccountId: validInput.sourceAccountId,
          destinationAccountId: validInput.destinationAccountId,
          amount: validInput.amount,
          currency: validInput.currency,
          fxQuoteId: null,
          status: 'COMPLETED',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      // hashPayload runs normally -- we need the real hash
      const { hashPayload } = jest.requireActual('@novapay/shared') as {
        hashPayload: (payload: Record<string, unknown>) => string;
      };
      const realHash = hashPayload({
        sourceAccountId: validInput.sourceAccountId,
        destinationAccountId: validInput.destinationAccountId,
        amount: validInput.amount,
        currency: validInput.currency,
      });

      mockPrisma.idempotencyRecord.findUnique.mockResolvedValue({
        key: validInput.idempotencyKey,
        payloadHash: realHash,
        response: { statusCode: 200, body: cachedBody },
        expiresAt: new Date(Date.now() + 60000),
      });

      const result = await service.disburse(validInput);

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(cachedBody);
      expect(mockPrisma.transaction.create).not.toHaveBeenCalled();
    });

    it('throws IdempotencyConflictError when same key has different payload hash', async () => {
      mockRedisInstance.set.mockResolvedValue('OK');
      mockRedisInstance.get.mockResolvedValue(expect.any(String));

      mockPrisma.idempotencyRecord.findUnique.mockResolvedValue({
        key: validInput.idempotencyKey,
        payloadHash: 'different-hash-value',
        response: null,
        expiresAt: new Date(Date.now() + 60000),
      });

      await expect(service.disburse(validInput)).rejects.toMatchObject({
        code: 'IDEMPOTENCY_CONFLICT',
      });
    });

    it('processes new transaction successfully (lock acquired, no existing record)', async () => {
      mockRedisInstance.set.mockResolvedValue('OK');
      mockRedisInstance.get.mockResolvedValue('some-lock-value');

      mockPrisma.idempotencyRecord.findUnique.mockResolvedValue(null);

      const now = new Date();
      const createdTx = {
        id: 'tx-new-1',
        idempotencyKey: validInput.idempotencyKey,
        sourceAccountId: validInput.sourceAccountId,
        destinationAccountId: validInput.destinationAccountId,
        amount: { toString: () => validInput.amount },
        currency: validInput.currency,
        fxQuoteId: null,
        status: TransactionStatus.PENDING,
        payloadHash: 'hash',
        createdAt: now,
        updatedAt: now,
      };

      const completedTx = {
        ...createdTx,
        status: TransactionStatus.COMPLETED,
      };

      mockPrisma.transaction.create.mockResolvedValue(createdTx);
      mockPrisma.transaction.update
        .mockResolvedValueOnce({ ...createdTx, status: TransactionStatus.PROCESSING })
        .mockResolvedValueOnce(completedTx);

      mockedAxios.post.mockResolvedValue({ data: {} });
      mockPrisma.idempotencyRecord.create.mockResolvedValue({});

      const result = await service.disburse(validInput);

      expect(result.statusCode).toBe(201);
      expect(result.body.transaction.id).toBe('tx-new-1');
      expect(result.body.transaction.status).toBe(TransactionStatus.COMPLETED);
      expect(mockPrisma.transaction.create).toHaveBeenCalled();
      expect(mockedAxios.post).toHaveBeenCalledTimes(3); // debit, ledger, credit
    });

    it('reverses transaction if credit fails after debit succeeds', async () => {
      mockRedisInstance.set.mockResolvedValue('OK');
      mockRedisInstance.get.mockResolvedValue('some-lock-value');

      mockPrisma.idempotencyRecord.findUnique.mockResolvedValue(null);

      const now = new Date();
      const createdTx = {
        id: 'tx-reverse-1',
        idempotencyKey: validInput.idempotencyKey,
        sourceAccountId: validInput.sourceAccountId,
        destinationAccountId: validInput.destinationAccountId,
        amount: { toString: () => validInput.amount },
        currency: validInput.currency,
        fxQuoteId: null,
        status: TransactionStatus.PENDING,
        payloadHash: 'hash',
        createdAt: now,
        updatedAt: now,
      };

      mockPrisma.transaction.create.mockResolvedValue(createdTx);
      mockPrisma.transaction.update.mockResolvedValue({
        ...createdTx,
        status: TransactionStatus.PROCESSING,
      });

      // First call (debit) succeeds, second call (ledger) succeeds, third call (credit) fails
      mockedAxios.post
        .mockResolvedValueOnce({ data: {} }) // debit
        .mockResolvedValueOnce({ data: {} }) // ledger
        .mockRejectedValueOnce(new Error('Credit service unavailable')); // credit fails

      // Reversal credit succeeds
      mockedAxios.post.mockResolvedValueOnce({ data: {} });

      mockPrisma.transaction.update.mockResolvedValue({
        ...createdTx,
        status: TransactionStatus.REVERSED,
      });

      await expect(service.disburse(validInput)).rejects.toMatchObject({
        statusCode: 500,
      });

      // Should have attempted reversal: credit back to source
      const reversalCall = mockedAxios.post.mock.calls[3];
      expect(reversalCall).toBeDefined();
      expect(reversalCall![0]).toContain(validInput.sourceAccountId);
      expect(reversalCall![1]).toEqual({
        amount: validInput.amount,
        type: 'CREDIT',
      });
    });
  });

  describe('getTransactionById', () => {
    it('returns transaction', async () => {
      const now = new Date();
      const tx = {
        id: 'tx-find-1',
        idempotencyKey: 'key-1',
        sourceAccountId: validInput.sourceAccountId,
        destinationAccountId: validInput.destinationAccountId,
        amount: { toString: () => '500.00' },
        currency: 'USD',
        fxQuoteId: null,
        status: 'COMPLETED',
        createdAt: now,
        updatedAt: now,
      };

      mockPrisma.transaction.findUnique.mockResolvedValue(tx);

      const result = await service.getTransactionById('tx-find-1');

      expect(result.transaction.id).toBe('tx-find-1');
      expect(result.transaction.amount).toBe('500.00');
      expect(mockPrisma.transaction.findUnique).toHaveBeenCalledWith({
        where: { id: 'tx-find-1' },
      });
    });

    it('throws NotFoundError', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue(null);

      await expect(service.getTransactionById('nonexistent')).rejects.toMatchObject({
        code: 'NOT_FOUND',
        statusCode: 404,
      });
    });
  });

  describe('getStalledTransactions', () => {
    it('returns transactions stuck in PROCESSING', async () => {
      const stalledTx = {
        id: 'tx-stalled-1',
        idempotencyKey: 'stalled-key',
        sourceAccountId: validInput.sourceAccountId,
        destinationAccountId: validInput.destinationAccountId,
        amount: { toString: () => '200.00' },
        currency: 'USD',
        fxQuoteId: null,
        status: 'PROCESSING',
        createdAt: new Date(Date.now() - 600000),
        updatedAt: new Date(Date.now() - 600000),
      };

      mockPrisma.transaction.findMany.mockResolvedValue([stalledTx]);

      const result = await service.getStalledTransactions();

      expect(result).toHaveLength(1);
      expect(result[0]!.transaction.id).toBe('tx-stalled-1');
      expect(result[0]!.transaction.status).toBe('PROCESSING');
      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith({
        where: {
          status: TransactionStatus.PROCESSING,
          updatedAt: { lt: expect.any(Date) },
        },
      });
    });
  });
});
