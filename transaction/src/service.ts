import { Prisma, TransactionStatus } from '../generated/prisma';
import Redis from 'ioredis';
import axios, { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Counter, Histogram } from 'prom-client';
import {
  createLogger,
  hashPayload,
  IdempotencyConflictError,
  NotFoundError,
  AppError,
  ErrorCode,
} from '@novapay/shared';
import type { DisbursementInput } from '@novapay/shared';
import { prisma } from './repository';

const logger = createLogger('transaction-service');

const LOCK_TTL_SECONDS = 30;
const IDEMPOTENCY_EXPIRY_HOURS = 24;
const STALLED_THRESHOLD_MINUTES = 5;

const ACCOUNT_SERVICE_URL = process.env['ACCOUNT_SERVICE_URL'] ?? 'http://account-service:3001';
const LEDGER_SERVICE_URL = process.env['LEDGER_SERVICE_URL'] ?? 'http://ledger-service:3003';
const FX_SERVICE_URL = process.env['FX_SERVICE_URL'] ?? 'http://fx-service:3004';

const transactionsTotal = new Counter({
  name: 'transactions_total',
  help: 'Total number of transactions processed',
  labelNames: ['status'] as const,
});

const transactionDuration = new Histogram({
  name: 'transaction_duration_seconds',
  help: 'Duration of transaction processing in seconds',
  labelNames: ['status'] as const,
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

interface DisbursementResponse {
  transaction: {
    id: string;
    idempotencyKey: string;
    sourceAccountId: string;
    destinationAccountId: string;
    amount: string;
    currency: string;
    fxQuoteId: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface CachedResponse {
  statusCode: number;
  body: DisbursementResponse;
}

export class TransactionService {
  private readonly redis: Redis;

  constructor(redisUrl?: string) {
    this.redis = new Redis(redisUrl ?? process.env['REDIS_URL'] ?? 'redis://localhost:6379');
  }

  async disburse(input: DisbursementInput): Promise<{ statusCode: number; body: DisbursementResponse }> {
    const timer = transactionDuration.startTimer();
    let finalStatus: TransactionStatus = 'FAILED' as TransactionStatus;

    try {
      const result = await this.processDisburse(input);
      finalStatus = 'COMPLETED' as TransactionStatus;
      timer({ status: finalStatus });
      transactionsTotal.inc({ status: finalStatus });
      return result;
    } catch (error) {
      timer({ status: finalStatus });
      transactionsTotal.inc({ status: finalStatus });
      throw error;
    }
  }

  private async processDisburse(input: DisbursementInput): Promise<{ statusCode: number; body: DisbursementResponse }> {
    const { idempotencyKey, sourceAccountId, destinationAccountId, amount, currency, fxQuoteId } = input;

    // Step (a): Hash the payload
    const payload = { sourceAccountId, destinationAccountId, amount, currency };
    const payloadHash = hashPayload(payload);

    // Step (b): Acquire distributed lock via Redis SET NX EX
    const lockKey = `lock:idempotency:${idempotencyKey}`;
    const lockValue = uuidv4();
    const lockAcquired = await this.redis.set(lockKey, lockValue, 'EX', LOCK_TTL_SECONDS, 'NX');

    if (!lockAcquired) {
      throw new AppError(
        ErrorCode.CONCURRENT_MODIFICATION,
        `Concurrent request detected for idempotency key: ${idempotencyKey}`,
        409,
      );
    }

    try {
      // Step (c): Check IdempotencyRecord
      const existingRecord = await prisma.idempotencyRecord.findUnique({
        where: { key: idempotencyKey },
      });

      if (existingRecord) {
        const now = new Date();
        const isExpired = existingRecord.expiresAt < now;

        if (!isExpired) {
          if (existingRecord.payloadHash === payloadHash) {
            // Deduplicate: return cached response
            logger.info({ idempotencyKey }, 'Returning cached idempotent response');
            const cached = existingRecord.response as CachedResponse | null;
            if (cached) {
              return { statusCode: cached.statusCode, body: cached.body };
            }
          } else {
            // Payload mismatch
            throw new IdempotencyConflictError(idempotencyKey);
          }
        } else {
          // Expired: delete old record and proceed as new
          await prisma.idempotencyRecord.delete({
            where: { key: idempotencyKey },
          });
          logger.info({ idempotencyKey }, 'Expired idempotency record removed');
        }
      }

      // Step (d): Create Transaction with PENDING status
      const transaction = await prisma.transaction.create({
        data: {
          idempotencyKey,
          sourceAccountId,
          destinationAccountId,
          amount: new Prisma.Decimal(amount),
          currency,
          fxQuoteId: fxQuoteId ?? null,
          status: TransactionStatus.PENDING,
          payloadHash,
        },
      });

      logger.info({ transactionId: transaction.id, idempotencyKey }, 'Transaction created with PENDING status');

      // Mark as PROCESSING
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: TransactionStatus.PROCESSING },
      });

      let debitCompleted = false;

      try {
        // Step (e): Debit source account
        await axios.post(`${ACCOUNT_SERVICE_URL}/accounts/${sourceAccountId}/balance`, {
          amount,
          type: 'DEBIT',
        });
        debitCompleted = true;
        logger.info({ transactionId: transaction.id, sourceAccountId, amount }, 'Source account debited');

        // Step (f): Create ledger entries
        await axios.post(`${LEDGER_SERVICE_URL}/entries`, {
          transactionId: transaction.id,
          sourceAccountId,
          destinationAccountId,
          amount,
          currency,
        });
        logger.info({ transactionId: transaction.id }, 'Ledger entries created');

        // Step (g): Credit destination account
        await axios.post(`${ACCOUNT_SERVICE_URL}/accounts/${destinationAccountId}/balance`, {
          amount,
          type: 'CREDIT',
        });
        logger.info({ transactionId: transaction.id, destinationAccountId, amount }, 'Destination account credited');

        // Step (h): If FX quote provided, validate/consume it
        if (fxQuoteId) {
          await axios.post(`${FX_SERVICE_URL}/quotes/${fxQuoteId}/consume`);
          logger.info({ transactionId: transaction.id, fxQuoteId }, 'FX quote consumed');
        }

        // Step (i): Update transaction to COMPLETED
        const completed = await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: TransactionStatus.COMPLETED },
        });

        logger.info({ transactionId: transaction.id }, 'Transaction completed successfully');

        // Step (j): Save IdempotencyRecord
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + IDEMPOTENCY_EXPIRY_HOURS);

        const responseBody: DisbursementResponse = {
          transaction: {
            id: completed.id,
            idempotencyKey: completed.idempotencyKey,
            sourceAccountId: completed.sourceAccountId,
            destinationAccountId: completed.destinationAccountId,
            amount: completed.amount.toString(),
            currency: completed.currency,
            fxQuoteId: completed.fxQuoteId,
            status: completed.status,
            createdAt: completed.createdAt,
            updatedAt: completed.updatedAt,
          },
        };

        const cachedResponse: CachedResponse = {
          statusCode: 201,
          body: responseBody,
        };

        await prisma.idempotencyRecord.create({
          data: {
            key: idempotencyKey,
            payloadHash,
            response: cachedResponse as unknown as Prisma.InputJsonValue,
            expiresAt,
          },
        });

        return { statusCode: 201, body: responseBody };
      } catch (processingError) {
        // Crash recovery: if debit succeeded but subsequent steps failed
        logger.error(
          {
            transactionId: transaction.id,
            debitCompleted,
            error: processingError instanceof Error ? processingError.message : String(processingError),
          },
          'Transaction processing failed, attempting recovery',
        );

        if (debitCompleted) {
          try {
            // Attempt reversal: credit back to source
            await axios.post(`${ACCOUNT_SERVICE_URL}/accounts/${sourceAccountId}/balance`, {
              amount,
              type: 'CREDIT',
            });

            await prisma.transaction.update({
              where: { id: transaction.id },
              data: { status: TransactionStatus.REVERSED },
            });

            logger.info({ transactionId: transaction.id }, 'Transaction reversed after failure');
          } catch (reversalError) {
            logger.error(
              {
                transactionId: transaction.id,
                error: reversalError instanceof Error ? reversalError.message : String(reversalError),
              },
              'Reversal failed, transaction stuck in PROCESSING for manual recovery',
            );

            // Leave in PROCESSING for recovery mechanism to pick up
          }
        } else {
          await prisma.transaction.update({
            where: { id: transaction.id },
            data: { status: TransactionStatus.FAILED },
          });
        }

        if (processingError instanceof AppError) {
          throw processingError;
        }

        const axiosErr = processingError as AxiosError<{ message?: string }>;
        const message = axiosErr.response?.data?.message ?? axiosErr.message ?? 'Transaction processing failed';
        throw new AppError(ErrorCode.TRANSACTION_FAILED, message, 500);
      }
    } finally {
      // Step (k): Release Redis lock (only if we still own it)
      const currentValue = await this.redis.get(lockKey);
      if (currentValue === lockValue) {
        await this.redis.del(lockKey);
      }
    }
  }

  async getTransactionById(id: string): Promise<DisbursementResponse> {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundError('Transaction', id);
    }

    return {
      transaction: {
        id: transaction.id,
        idempotencyKey: transaction.idempotencyKey,
        sourceAccountId: transaction.sourceAccountId,
        destinationAccountId: transaction.destinationAccountId,
        amount: transaction.amount.toString(),
        currency: transaction.currency,
        fxQuoteId: transaction.fxQuoteId,
        status: transaction.status,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      },
    };
  }

  async getTransactionByIdempotencyKey(idempotencyKey: string): Promise<DisbursementResponse> {
    const transaction = await prisma.transaction.findUnique({
      where: { idempotencyKey },
    });

    if (!transaction) {
      throw new NotFoundError('Transaction', idempotencyKey);
    }

    return {
      transaction: {
        id: transaction.id,
        idempotencyKey: transaction.idempotencyKey,
        sourceAccountId: transaction.sourceAccountId,
        destinationAccountId: transaction.destinationAccountId,
        amount: transaction.amount.toString(),
        currency: transaction.currency,
        fxQuoteId: transaction.fxQuoteId,
        status: transaction.status,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      },
    };
  }

  async reverseTransaction(id: string): Promise<DisbursementResponse> {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundError('Transaction', id);
    }

    if (transaction.status !== TransactionStatus.COMPLETED) {
      throw new AppError(
        ErrorCode.TRANSACTION_FAILED,
        `Cannot reverse transaction with status: ${transaction.status}`,
        422,
      );
    }

    try {
      // Debit from destination (reverse the credit)
      await axios.post(`${ACCOUNT_SERVICE_URL}/accounts/${transaction.destinationAccountId}/balance`, {
        amount: transaction.amount.toString(),
        type: 'DEBIT',
      });

      // Credit back to source (reverse the debit)
      await axios.post(`${ACCOUNT_SERVICE_URL}/accounts/${transaction.sourceAccountId}/balance`, {
        amount: transaction.amount.toString(),
        type: 'CREDIT',
      });

      // Create reversal ledger entries
      await axios.post(`${LEDGER_SERVICE_URL}/entries`, {
        transactionId: transaction.id,
        sourceAccountId: transaction.destinationAccountId,
        destinationAccountId: transaction.sourceAccountId,
        amount: transaction.amount.toString(),
        currency: transaction.currency,
      });

      const reversed = await prisma.transaction.update({
        where: { id },
        data: { status: TransactionStatus.REVERSED },
      });

      logger.info({ transactionId: id }, 'Transaction reversed');

      return {
        transaction: {
          id: reversed.id,
          idempotencyKey: reversed.idempotencyKey,
          sourceAccountId: reversed.sourceAccountId,
          destinationAccountId: reversed.destinationAccountId,
          amount: reversed.amount.toString(),
          currency: reversed.currency,
          fxQuoteId: reversed.fxQuoteId,
          status: reversed.status,
          createdAt: reversed.createdAt,
          updatedAt: reversed.updatedAt,
        },
      };
    } catch (error) {
      logger.error(
        {
          transactionId: id,
          error: error instanceof Error ? error.message : String(error),
        },
        'Reversal failed',
      );

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(ErrorCode.TRANSACTION_FAILED, 'Transaction reversal failed', 500);
    }
  }

  async getStalledTransactions(): Promise<DisbursementResponse[]> {
    const threshold = new Date();
    threshold.setMinutes(threshold.getMinutes() - STALLED_THRESHOLD_MINUTES);

    const stalled = await prisma.transaction.findMany({
      where: {
        status: TransactionStatus.PROCESSING,
        updatedAt: { lt: threshold },
      },
    });

    return stalled.map((t) => ({
      transaction: {
        id: t.id,
        idempotencyKey: t.idempotencyKey,
        sourceAccountId: t.sourceAccountId,
        destinationAccountId: t.destinationAccountId,
        amount: t.amount.toString(),
        currency: t.currency,
        fxQuoteId: t.fxQuoteId,
        status: t.status,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      },
    }));
  }

  async disconnect(): Promise<void> {
    this.redis.disconnect();
    await prisma.$disconnect();
  }
}

export const transactionService = new TransactionService();
