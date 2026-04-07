"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionService = exports.TransactionService = void 0;
const prisma_1 = require("../generated/prisma");
const ioredis_1 = __importDefault(require("ioredis"));
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const prom_client_1 = require("prom-client");
const shared_1 = require("@novapay/shared");
const repository_1 = require("./repository");
const logger = (0, shared_1.createLogger)('transaction-service');
const LOCK_TTL_SECONDS = 30;
const IDEMPOTENCY_EXPIRY_HOURS = 24;
const STALLED_THRESHOLD_MINUTES = 5;
const ACCOUNT_SERVICE_URL = process.env['ACCOUNT_SERVICE_URL'] ?? 'http://account-service:3001';
const LEDGER_SERVICE_URL = process.env['LEDGER_SERVICE_URL'] ?? 'http://ledger-service:3003';
const FX_SERVICE_URL = process.env['FX_SERVICE_URL'] ?? 'http://fx-service:3004';
const transactionsTotal = new prom_client_1.Counter({
    name: 'transactions_total',
    help: 'Total number of transactions processed',
    labelNames: ['status'],
});
const transactionDuration = new prom_client_1.Histogram({
    name: 'transaction_duration_seconds',
    help: 'Duration of transaction processing in seconds',
    labelNames: ['status'],
    buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});
class TransactionService {
    redis;
    constructor(redisUrl) {
        this.redis = new ioredis_1.default(redisUrl ?? process.env['REDIS_URL'] ?? 'redis://localhost:6379');
    }
    async disburse(input) {
        const timer = transactionDuration.startTimer();
        let finalStatus = 'FAILED';
        try {
            const result = await this.processDisburse(input);
            finalStatus = 'COMPLETED';
            timer({ status: finalStatus });
            transactionsTotal.inc({ status: finalStatus });
            return result;
        }
        catch (error) {
            timer({ status: finalStatus });
            transactionsTotal.inc({ status: finalStatus });
            throw error;
        }
    }
    async processDisburse(input) {
        const { idempotencyKey, sourceAccountId, destinationAccountId, amount, currency, fxQuoteId } = input;
        // Step (a): Hash the payload
        const payload = { sourceAccountId, destinationAccountId, amount, currency };
        const payloadHash = (0, shared_1.hashPayload)(payload);
        // Step (b): Acquire distributed lock via Redis SET NX EX
        const lockKey = `lock:idempotency:${idempotencyKey}`;
        const lockValue = (0, uuid_1.v4)();
        const lockAcquired = await this.redis.set(lockKey, lockValue, 'EX', LOCK_TTL_SECONDS, 'NX');
        if (!lockAcquired) {
            throw new shared_1.AppError(shared_1.ErrorCode.CONCURRENT_MODIFICATION, `Concurrent request detected for idempotency key: ${idempotencyKey}`, 409);
        }
        try {
            // Step (c): Check IdempotencyRecord
            const existingRecord = await repository_1.prisma.idempotencyRecord.findUnique({
                where: { key: idempotencyKey },
            });
            if (existingRecord) {
                const now = new Date();
                const isExpired = existingRecord.expiresAt < now;
                if (!isExpired) {
                    if (existingRecord.payloadHash === payloadHash) {
                        // Deduplicate: return cached response
                        logger.info({ idempotencyKey }, 'Returning cached idempotent response');
                        const cached = existingRecord.response;
                        if (cached) {
                            return { statusCode: cached.statusCode, body: cached.body };
                        }
                    }
                    else {
                        // Payload mismatch
                        throw new shared_1.IdempotencyConflictError(idempotencyKey);
                    }
                }
                else {
                    // Expired: delete old record and proceed as new
                    await repository_1.prisma.idempotencyRecord.delete({
                        where: { key: idempotencyKey },
                    });
                    logger.info({ idempotencyKey }, 'Expired idempotency record removed');
                }
            }
            // Step (d): Create Transaction with PENDING status
            const transaction = await repository_1.prisma.transaction.create({
                data: {
                    idempotencyKey,
                    sourceAccountId,
                    destinationAccountId,
                    amount: new prisma_1.Prisma.Decimal(amount),
                    currency,
                    fxQuoteId: fxQuoteId ?? null,
                    status: prisma_1.TransactionStatus.PENDING,
                    payloadHash,
                },
            });
            logger.info({ transactionId: transaction.id, idempotencyKey }, 'Transaction created with PENDING status');
            // Mark as PROCESSING
            await repository_1.prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: prisma_1.TransactionStatus.PROCESSING },
            });
            let debitCompleted = false;
            try {
                // Step (e): Debit source account
                await axios_1.default.post(`${ACCOUNT_SERVICE_URL}/accounts/${sourceAccountId}/balance`, {
                    amount,
                    type: 'DEBIT',
                });
                debitCompleted = true;
                logger.info({ transactionId: transaction.id, sourceAccountId, amount }, 'Source account debited');
                // Step (f): Create ledger entries
                await axios_1.default.post(`${LEDGER_SERVICE_URL}/entries`, {
                    transactionId: transaction.id,
                    sourceAccountId,
                    destinationAccountId,
                    amount,
                    currency,
                });
                logger.info({ transactionId: transaction.id }, 'Ledger entries created');
                // Step (g): Credit destination account
                await axios_1.default.post(`${ACCOUNT_SERVICE_URL}/accounts/${destinationAccountId}/balance`, {
                    amount,
                    type: 'CREDIT',
                });
                logger.info({ transactionId: transaction.id, destinationAccountId, amount }, 'Destination account credited');
                // Step (h): If FX quote provided, validate/consume it
                if (fxQuoteId) {
                    await axios_1.default.post(`${FX_SERVICE_URL}/quotes/${fxQuoteId}/consume`);
                    logger.info({ transactionId: transaction.id, fxQuoteId }, 'FX quote consumed');
                }
                // Step (i): Update transaction to COMPLETED
                const completed = await repository_1.prisma.transaction.update({
                    where: { id: transaction.id },
                    data: { status: prisma_1.TransactionStatus.COMPLETED },
                });
                logger.info({ transactionId: transaction.id }, 'Transaction completed successfully');
                // Step (j): Save IdempotencyRecord
                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + IDEMPOTENCY_EXPIRY_HOURS);
                const responseBody = {
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
                const cachedResponse = {
                    statusCode: 201,
                    body: responseBody,
                };
                await repository_1.prisma.idempotencyRecord.create({
                    data: {
                        key: idempotencyKey,
                        payloadHash,
                        response: cachedResponse,
                        expiresAt,
                    },
                });
                return { statusCode: 201, body: responseBody };
            }
            catch (processingError) {
                // Crash recovery: if debit succeeded but subsequent steps failed
                logger.error({
                    transactionId: transaction.id,
                    debitCompleted,
                    error: processingError instanceof Error ? processingError.message : String(processingError),
                }, 'Transaction processing failed, attempting recovery');
                if (debitCompleted) {
                    try {
                        // Attempt reversal: credit back to source
                        await axios_1.default.post(`${ACCOUNT_SERVICE_URL}/accounts/${sourceAccountId}/balance`, {
                            amount,
                            type: 'CREDIT',
                        });
                        await repository_1.prisma.transaction.update({
                            where: { id: transaction.id },
                            data: { status: prisma_1.TransactionStatus.REVERSED },
                        });
                        logger.info({ transactionId: transaction.id }, 'Transaction reversed after failure');
                    }
                    catch (reversalError) {
                        logger.error({
                            transactionId: transaction.id,
                            error: reversalError instanceof Error ? reversalError.message : String(reversalError),
                        }, 'Reversal failed, transaction stuck in PROCESSING for manual recovery');
                        // Leave in PROCESSING for recovery mechanism to pick up
                    }
                }
                else {
                    await repository_1.prisma.transaction.update({
                        where: { id: transaction.id },
                        data: { status: prisma_1.TransactionStatus.FAILED },
                    });
                }
                if (processingError instanceof shared_1.AppError) {
                    throw processingError;
                }
                const axiosErr = processingError;
                const message = axiosErr.response?.data?.message ?? axiosErr.message ?? 'Transaction processing failed';
                throw new shared_1.AppError(shared_1.ErrorCode.TRANSACTION_FAILED, message, 500);
            }
        }
        finally {
            // Step (k): Release Redis lock (only if we still own it)
            const currentValue = await this.redis.get(lockKey);
            if (currentValue === lockValue) {
                await this.redis.del(lockKey);
            }
        }
    }
    async getTransactionById(id) {
        const transaction = await repository_1.prisma.transaction.findUnique({
            where: { id },
        });
        if (!transaction) {
            throw new shared_1.NotFoundError('Transaction', id);
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
    async getTransactionByIdempotencyKey(idempotencyKey) {
        const transaction = await repository_1.prisma.transaction.findUnique({
            where: { idempotencyKey },
        });
        if (!transaction) {
            throw new shared_1.NotFoundError('Transaction', idempotencyKey);
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
    async reverseTransaction(id) {
        const transaction = await repository_1.prisma.transaction.findUnique({
            where: { id },
        });
        if (!transaction) {
            throw new shared_1.NotFoundError('Transaction', id);
        }
        if (transaction.status !== prisma_1.TransactionStatus.COMPLETED) {
            throw new shared_1.AppError(shared_1.ErrorCode.TRANSACTION_FAILED, `Cannot reverse transaction with status: ${transaction.status}`, 422);
        }
        try {
            // Debit from destination (reverse the credit)
            await axios_1.default.post(`${ACCOUNT_SERVICE_URL}/accounts/${transaction.destinationAccountId}/balance`, {
                amount: transaction.amount.toString(),
                type: 'DEBIT',
            });
            // Credit back to source (reverse the debit)
            await axios_1.default.post(`${ACCOUNT_SERVICE_URL}/accounts/${transaction.sourceAccountId}/balance`, {
                amount: transaction.amount.toString(),
                type: 'CREDIT',
            });
            // Create reversal ledger entries
            await axios_1.default.post(`${LEDGER_SERVICE_URL}/entries`, {
                transactionId: transaction.id,
                sourceAccountId: transaction.destinationAccountId,
                destinationAccountId: transaction.sourceAccountId,
                amount: transaction.amount.toString(),
                currency: transaction.currency,
            });
            const reversed = await repository_1.prisma.transaction.update({
                where: { id },
                data: { status: prisma_1.TransactionStatus.REVERSED },
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
        }
        catch (error) {
            logger.error({
                transactionId: id,
                error: error instanceof Error ? error.message : String(error),
            }, 'Reversal failed');
            if (error instanceof shared_1.AppError) {
                throw error;
            }
            throw new shared_1.AppError(shared_1.ErrorCode.TRANSACTION_FAILED, 'Transaction reversal failed', 500);
        }
    }
    async getStalledTransactions() {
        const threshold = new Date();
        threshold.setMinutes(threshold.getMinutes() - STALLED_THRESHOLD_MINUTES);
        const stalled = await repository_1.prisma.transaction.findMany({
            where: {
                status: prisma_1.TransactionStatus.PROCESSING,
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
    async disconnect() {
        this.redis.disconnect();
        await repository_1.prisma.$disconnect();
    }
}
exports.TransactionService = TransactionService;
exports.transactionService = new TransactionService();
//# sourceMappingURL=service.js.map