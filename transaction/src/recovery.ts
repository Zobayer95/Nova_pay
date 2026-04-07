import axios from 'axios';
import { TransactionStatus } from '../generated/prisma';
import { createLogger, AppError, ErrorCode } from '@novapay/shared';
import { prisma } from './repository';

const logger = createLogger('transaction-recovery');

const STALLED_THRESHOLD_MINUTES = 5;
const ACCOUNT_SERVICE_URL = process.env['ACCOUNT_SERVICE_URL'] ?? 'http://account-service:3001';
const LEDGER_SERVICE_URL = process.env['LEDGER_SERVICE_URL'] ?? 'http://ledger-service:3003';

interface RecoveryResult {
  transactionId: string;
  action: 'completed' | 'reversed' | 'failed';
  error?: string;
}

export async function scanStalledTransactions(): Promise<string[]> {
  const threshold = new Date();
  threshold.setMinutes(threshold.getMinutes() - STALLED_THRESHOLD_MINUTES);

  const stalled = await prisma.transaction.findMany({
    where: {
      status: TransactionStatus.PROCESSING,
      updatedAt: { lt: threshold },
    },
    select: { id: true },
  });

  const ids = stalled.map((t) => t.id);

  if (ids.length > 0) {
    logger.warn({ count: ids.length, ids }, 'Found stalled transactions');
  }

  return ids;
}

export async function recoverTransaction(id: string): Promise<RecoveryResult> {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!transaction) {
    throw new AppError(ErrorCode.NOT_FOUND, `Transaction not found: ${id}`, 404);
  }

  if (transaction.status !== TransactionStatus.PROCESSING) {
    return { transactionId: id, action: 'completed' };
  }

  logger.info({ transactionId: id }, 'Attempting transaction recovery');

  try {
    // Check if the destination was already credited by querying the ledger
    let ledgerEntriesExist = false;

    try {
      const ledgerResponse = await axios.get<{ entries: unknown[] }>(
        `${LEDGER_SERVICE_URL}/entries/transaction/${id}`,
      );
      ledgerEntriesExist = ledgerResponse.data.entries.length > 0;
    } catch {
      // Ledger entries do not exist
      ledgerEntriesExist = false;
    }

    if (ledgerEntriesExist) {
      // Ledger entries exist, attempt to complete the transaction
      // Credit destination if not already done
      try {
        await axios.post(
          `${ACCOUNT_SERVICE_URL}/accounts/${transaction.destinationAccountId}/balance`,
          {
            amount: transaction.amount.toString(),
            type: 'CREDIT',
          },
        );
      } catch {
        // If credit fails, we need to reverse everything
        logger.error({ transactionId: id }, 'Failed to credit destination during recovery, reversing');
        return await reverseStalled(id, transaction.sourceAccountId, transaction.amount.toString());
      }

      await prisma.transaction.update({
        where: { id },
        data: { status: TransactionStatus.COMPLETED },
      });

      logger.info({ transactionId: id }, 'Stalled transaction completed via recovery');
      return { transactionId: id, action: 'completed' };
    } else {
      // No ledger entries: reverse by crediting back source
      return await reverseStalled(id, transaction.sourceAccountId, transaction.amount.toString());
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error({ transactionId: id, error: message }, 'Recovery failed');

    await prisma.transaction.update({
      where: { id },
      data: { status: TransactionStatus.FAILED },
    });

    return { transactionId: id, action: 'failed', error: message };
  }
}

async function reverseStalled(
  transactionId: string,
  sourceAccountId: string,
  amount: string,
): Promise<RecoveryResult> {
  try {
    await axios.post(`${ACCOUNT_SERVICE_URL}/accounts/${sourceAccountId}/balance`, {
      amount,
      type: 'CREDIT',
    });

    await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: TransactionStatus.REVERSED },
    });

    logger.info({ transactionId }, 'Stalled transaction reversed via recovery');
    return { transactionId, action: 'reversed' };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error({ transactionId, error: message }, 'Reversal during recovery failed');

    await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: TransactionStatus.FAILED },
    });

    return { transactionId, action: 'failed', error: message };
  }
}

export async function runRecoveryCycle(): Promise<RecoveryResult[]> {
  const stalledIds = await scanStalledTransactions();
  const results: RecoveryResult[] = [];

  for (const id of stalledIds) {
    const result = await recoverTransaction(id);
    results.push(result);
  }

  if (results.length > 0) {
    logger.info({ results }, 'Recovery cycle completed');
  }

  return results;
}
