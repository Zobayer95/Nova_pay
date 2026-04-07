"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanStalledTransactions = scanStalledTransactions;
exports.recoverTransaction = recoverTransaction;
exports.runRecoveryCycle = runRecoveryCycle;
const axios_1 = __importDefault(require("axios"));
const prisma_1 = require("../generated/prisma");
const shared_1 = require("@novapay/shared");
const repository_1 = require("./repository");
const logger = (0, shared_1.createLogger)('transaction-recovery');
const STALLED_THRESHOLD_MINUTES = 5;
const ACCOUNT_SERVICE_URL = process.env['ACCOUNT_SERVICE_URL'] ?? 'http://account-service:3001';
const LEDGER_SERVICE_URL = process.env['LEDGER_SERVICE_URL'] ?? 'http://ledger-service:3003';
async function scanStalledTransactions() {
    const threshold = new Date();
    threshold.setMinutes(threshold.getMinutes() - STALLED_THRESHOLD_MINUTES);
    const stalled = await repository_1.prisma.transaction.findMany({
        where: {
            status: prisma_1.TransactionStatus.PROCESSING,
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
async function recoverTransaction(id) {
    const transaction = await repository_1.prisma.transaction.findUnique({
        where: { id },
    });
    if (!transaction) {
        throw new shared_1.AppError(shared_1.ErrorCode.NOT_FOUND, `Transaction not found: ${id}`, 404);
    }
    if (transaction.status !== prisma_1.TransactionStatus.PROCESSING) {
        return { transactionId: id, action: 'completed' };
    }
    logger.info({ transactionId: id }, 'Attempting transaction recovery');
    try {
        // Check if the destination was already credited by querying the ledger
        let ledgerEntriesExist = false;
        try {
            const ledgerResponse = await axios_1.default.get(`${LEDGER_SERVICE_URL}/entries/transaction/${id}`);
            ledgerEntriesExist = ledgerResponse.data.entries.length > 0;
        }
        catch {
            // Ledger entries do not exist
            ledgerEntriesExist = false;
        }
        if (ledgerEntriesExist) {
            // Ledger entries exist, attempt to complete the transaction
            // Credit destination if not already done
            try {
                await axios_1.default.post(`${ACCOUNT_SERVICE_URL}/accounts/${transaction.destinationAccountId}/balance`, {
                    amount: transaction.amount.toString(),
                    type: 'CREDIT',
                });
            }
            catch {
                // If credit fails, we need to reverse everything
                logger.error({ transactionId: id }, 'Failed to credit destination during recovery, reversing');
                return await reverseStalled(id, transaction.sourceAccountId, transaction.amount.toString());
            }
            await repository_1.prisma.transaction.update({
                where: { id },
                data: { status: prisma_1.TransactionStatus.COMPLETED },
            });
            logger.info({ transactionId: id }, 'Stalled transaction completed via recovery');
            return { transactionId: id, action: 'completed' };
        }
        else {
            // No ledger entries: reverse by crediting back source
            return await reverseStalled(id, transaction.sourceAccountId, transaction.amount.toString());
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error({ transactionId: id, error: message }, 'Recovery failed');
        await repository_1.prisma.transaction.update({
            where: { id },
            data: { status: prisma_1.TransactionStatus.FAILED },
        });
        return { transactionId: id, action: 'failed', error: message };
    }
}
async function reverseStalled(transactionId, sourceAccountId, amount) {
    try {
        await axios_1.default.post(`${ACCOUNT_SERVICE_URL}/accounts/${sourceAccountId}/balance`, {
            amount,
            type: 'CREDIT',
        });
        await repository_1.prisma.transaction.update({
            where: { id: transactionId },
            data: { status: prisma_1.TransactionStatus.REVERSED },
        });
        logger.info({ transactionId }, 'Stalled transaction reversed via recovery');
        return { transactionId, action: 'reversed' };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error({ transactionId, error: message }, 'Reversal during recovery failed');
        await repository_1.prisma.transaction.update({
            where: { id: transactionId },
            data: { status: prisma_1.TransactionStatus.FAILED },
        });
        return { transactionId, action: 'failed', error: message };
    }
}
async function runRecoveryCycle() {
    const stalledIds = await scanStalledTransactions();
    const results = [];
    for (const id of stalledIds) {
        const result = await recoverTransaction(id);
        results.push(result);
    }
    if (results.length > 0) {
        logger.info({ results }, 'Recovery cycle completed');
    }
    return results;
}
//# sourceMappingURL=recovery.js.map