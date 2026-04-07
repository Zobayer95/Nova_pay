import { Prisma } from '../generated/prisma';
import {
  EnvelopeEncryption,
  createLogger,
  NotFoundError,
  InsufficientBalanceError,
} from '@novapay/shared';
import type { CreateAccountInput } from '@novapay/shared';
import { prisma } from './repository';

const logger = createLogger('account-service');

const masterKey = process.env['MASTER_ENCRYPTION_KEY'];
if (!masterKey) {
  throw new Error('MASTER_ENCRYPTION_KEY environment variable is required');
}

const encryption = new EnvelopeEncryption(masterKey);

export interface DecryptedAccount {
  id: string;
  userId: string;
  currency: string;
  balance: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface RawAccountRow {
  id: string;
  userId: string;
  currency: string;
  balance: Prisma.Decimal;
  encryptedName: string;
  encryptedEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

function decryptAccount(account: RawAccountRow): DecryptedAccount {
  return {
    id: account.id,
    userId: account.userId,
    currency: account.currency,
    balance: account.balance.toString(),
    name: encryption.decrypt(account.encryptedName),
    email: encryption.decrypt(account.encryptedEmail),
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}

export class AccountService {
  async createAccount(input: CreateAccountInput): Promise<DecryptedAccount> {
    logger.info({ userId: input.userId, currency: input.currency }, 'Creating account');

    const encryptedName = encryption.encrypt(input.name);
    const encryptedEmail = encryption.encrypt(input.email);

    const account = await prisma.account.create({
      data: {
        userId: input.userId,
        currency: input.currency,
        balance: new Prisma.Decimal(0),
        encryptedName,
        encryptedEmail,
      },
    });

    logger.info({ accountId: account.id, userId: input.userId }, 'Account created');

    return decryptAccount(account);
  }

  async getAccount(id: string): Promise<DecryptedAccount> {
    const account = await prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundError('Account', id);
    }

    return decryptAccount(account);
  }

  async getAccountsByUser(userId: string): Promise<DecryptedAccount[]> {
    const accounts = await prisma.account.findMany({
      where: { userId },
    });

    return accounts.map(decryptAccount);
  }

  async updateBalance(
    id: string,
    amount: string,
    type: 'CREDIT' | 'DEBIT',
  ): Promise<DecryptedAccount> {
    logger.info({ accountId: id, amount, type }, 'Updating balance');

    const decimalAmount = new Prisma.Decimal(amount);

    if (decimalAmount.lte(new Prisma.Decimal(0))) {
      throw new Error('Amount must be positive');
    }

    const result = await prisma.$transaction(async (tx) => {
      // Row-level locking with SELECT FOR UPDATE
      const rows = await tx.$queryRaw<RawAccountRow[]>`
        SELECT "id", "userId", "currency", "balance", "encryptedName", "encryptedEmail", "createdAt", "updatedAt"
        FROM "Account"
        WHERE "id" = ${id}::uuid
        FOR UPDATE
      `;

      const account = rows[0];
      if (!account) {
        throw new NotFoundError('Account', id);
      }

      const currentBalance = new Prisma.Decimal(account.balance.toString());
      let newBalance: Prisma.Decimal;

      if (type === 'DEBIT') {
        if (currentBalance.lt(decimalAmount)) {
          throw new InsufficientBalanceError(id);
        }
        newBalance = currentBalance.minus(decimalAmount);
      } else {
        newBalance = currentBalance.plus(decimalAmount);
      }

      const updated = await tx.account.update({
        where: { id },
        data: { balance: newBalance },
      });

      logger.info(
        { accountId: id, previousBalance: currentBalance.toString(), newBalance: newBalance.toString(), type },
        'Balance updated',
      );

      return updated;
    });

    return decryptAccount(result);
  }

  async getBalance(id: string): Promise<string> {
    const account = await prisma.account.findUnique({
      where: { id },
      select: { balance: true },
    });

    if (!account) {
      throw new NotFoundError('Account', id);
    }

    return account.balance.toString();
  }
}

export const accountService = new AccountService();
