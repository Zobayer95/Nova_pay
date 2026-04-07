process.env['MASTER_ENCRYPTION_KEY'] = 'a'.repeat(64);

jest.mock('../repository', () => ({
  prisma: {
    account: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
    $queryRaw: jest.fn(),
  },
}));

import { EnvelopeEncryption, NotFoundError, InsufficientBalanceError, Currency } from '@novapay/shared';
import { AccountService } from '../service';
import { prisma } from '../repository';

/* eslint-disable @typescript-eslint/no-explicit-any */
const mockedPrisma = prisma as any;
const encryption = new EnvelopeEncryption('a'.repeat(64));

function makeDecimal(value: string): { toString: () => string } {
  return { toString: () => value };
}

function makeRawAccount(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  const name = (overrides['name'] as string) ?? 'John Doe';
  const email = (overrides['email'] as string) ?? 'john@example.com';
  return {
    id: 'acc-123',
    userId: 'user-456',
    currency: 'USD',
    balance: makeDecimal('0.00'),
    encryptedName: encryption.encrypt(name),
    encryptedEmail: encryption.encrypt(email),
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    ...overrides,
  };
}

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(() => {
    service = new AccountService();
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('encrypts name/email and creates account with zero balance', async () => {
      const input = {
        userId: 'user-456',
        currency: Currency.USD,
        name: 'Jane Smith',
        email: 'jane@example.com',
      };

      (mockedPrisma.account.create as jest.Mock).mockImplementation(
        async (args: { data: Record<string, unknown> }) => {
          return {
            id: 'acc-new',
            userId: args.data['userId'],
            currency: args.data['currency'],
            balance: makeDecimal('0'),
            encryptedName: args.data['encryptedName'],
            encryptedEmail: args.data['encryptedEmail'],
            createdAt: new Date('2025-01-01'),
            updatedAt: new Date('2025-01-01'),
          };
        },
      );

      const result = await service.createAccount(input);

      expect(result.name).toBe('Jane Smith');
      expect(result.email).toBe('jane@example.com');
      expect(result.balance).toBe('0');
      expect(result.userId).toBe('user-456');

      const createCall = (mockedPrisma.account.create as jest.Mock).mock.calls[0][0];
      expect(createCall.data.encryptedName).not.toBe('Jane Smith');
      expect(createCall.data.encryptedEmail).not.toBe('jane@example.com');
      // Verify the encrypted values are valid JSON (envelope encryption format)
      expect(() => JSON.parse(createCall.data.encryptedName as string)).not.toThrow();
      expect(() => JSON.parse(createCall.data.encryptedEmail as string)).not.toThrow();
    });
  });

  describe('getAccount', () => {
    it('returns decrypted account', async () => {
      const raw = makeRawAccount({ name: 'Bob Jones', email: 'bob@test.com' });
      (mockedPrisma.account.findUnique as jest.Mock).mockResolvedValue(raw);

      const result = await service.getAccount('acc-123');

      expect(result.id).toBe('acc-123');
      expect(result.name).toBe('Bob Jones');
      expect(result.email).toBe('bob@test.com');
    });

    it('throws NotFoundError if account does not exist', async () => {
      (mockedPrisma.account.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getAccount('acc-missing')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getAccountsByUser', () => {
    it('returns all accounts decrypted', async () => {
      const raw1 = makeRawAccount({
        id: 'acc-1',
        name: 'Alice',
        email: 'alice@test.com',
      });
      const raw2 = makeRawAccount({
        id: 'acc-2',
        name: 'Bob',
        email: 'bob@test.com',
      });
      (mockedPrisma.account.findMany as jest.Mock).mockResolvedValue([raw1, raw2]);

      const results = await service.getAccountsByUser('user-456');

      expect(results).toHaveLength(2);
      expect(results[0]!.name).toBe('Alice');
      expect(results[0]!.email).toBe('alice@test.com');
      expect(results[1]!.name).toBe('Bob');
      expect(results[1]!.email).toBe('bob@test.com');
    });
  });

  describe('updateBalance', () => {
    it('increases balance on CREDIT', async () => {
      const raw = makeRawAccount({ balance: makeDecimal('100.00') });

      (mockedPrisma.$transaction as jest.Mock).mockImplementation(
        async (callback: (tx: unknown) => Promise<unknown>) => {
          const txMock = {
            $queryRaw: jest.fn().mockResolvedValue([raw]),
            account: {
              update: jest.fn().mockResolvedValue({
                ...raw,
                balance: makeDecimal('150.00'),
              }),
            },
          };
          return callback(txMock);
        },
      );

      const result = await service.updateBalance('acc-123', '50.00', 'CREDIT');

      expect(result.balance).toBe('150.00');
    });

    it('decreases balance on DEBIT', async () => {
      const raw = makeRawAccount({ balance: makeDecimal('100.00') });

      (mockedPrisma.$transaction as jest.Mock).mockImplementation(
        async (callback: (tx: unknown) => Promise<unknown>) => {
          const txMock = {
            $queryRaw: jest.fn().mockResolvedValue([raw]),
            account: {
              update: jest.fn().mockResolvedValue({
                ...raw,
                balance: makeDecimal('50.00'),
              }),
            },
          };
          return callback(txMock);
        },
      );

      const result = await service.updateBalance('acc-123', '50.00', 'DEBIT');

      expect(result.balance).toBe('50.00');
    });

    it('throws InsufficientBalanceError when insufficient funds on DEBIT', async () => {
      const raw = makeRawAccount({ balance: makeDecimal('30.00') });

      (mockedPrisma.$transaction as jest.Mock).mockImplementation(
        async (callback: (tx: unknown) => Promise<unknown>) => {
          const txMock = {
            $queryRaw: jest.fn().mockResolvedValue([raw]),
            account: {
              update: jest.fn(),
            },
          };
          return callback(txMock);
        },
      );

      await expect(
        service.updateBalance('acc-123', '50.00', 'DEBIT'),
      ).rejects.toThrow(InsufficientBalanceError);
    });
  });
});
