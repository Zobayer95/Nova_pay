"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountService = exports.AccountService = void 0;
const client_1 = require("@prisma/client");
const shared_1 = require("@novapay/shared");
const repository_1 = require("./repository");
const logger = (0, shared_1.createLogger)('account-service');
const masterKey = process.env['MASTER_ENCRYPTION_KEY'];
if (!masterKey) {
    throw new Error('MASTER_ENCRYPTION_KEY environment variable is required');
}
const encryption = new shared_1.EnvelopeEncryption(masterKey);
function decryptAccount(account) {
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
class AccountService {
    async createAccount(input) {
        logger.info({ userId: input.userId, currency: input.currency }, 'Creating account');
        const encryptedName = encryption.encrypt(input.name);
        const encryptedEmail = encryption.encrypt(input.email);
        const account = await repository_1.prisma.account.create({
            data: {
                userId: input.userId,
                currency: input.currency,
                balance: new client_1.Prisma.Decimal(0),
                encryptedName,
                encryptedEmail,
            },
        });
        logger.info({ accountId: account.id, userId: input.userId }, 'Account created');
        return decryptAccount(account);
    }
    async getAccount(id) {
        const account = await repository_1.prisma.account.findUnique({
            where: { id },
        });
        if (!account) {
            throw new shared_1.NotFoundError('Account', id);
        }
        return decryptAccount(account);
    }
    async getAccountsByUser(userId) {
        const accounts = await repository_1.prisma.account.findMany({
            where: { userId },
        });
        return accounts.map(decryptAccount);
    }
    async updateBalance(id, amount, type) {
        logger.info({ accountId: id, amount, type }, 'Updating balance');
        const decimalAmount = new client_1.Prisma.Decimal(amount);
        if (decimalAmount.lte(new client_1.Prisma.Decimal(0))) {
            throw new Error('Amount must be positive');
        }
        const result = await repository_1.prisma.$transaction(async (tx) => {
            // Row-level locking with SELECT FOR UPDATE
            const rows = await tx.$queryRaw `
        SELECT "id", "userId", "currency", "balance", "encryptedName", "encryptedEmail", "createdAt", "updatedAt"
        FROM "Account"
        WHERE "id" = ${id}::uuid
        FOR UPDATE
      `;
            const account = rows[0];
            if (!account) {
                throw new shared_1.NotFoundError('Account', id);
            }
            const currentBalance = new client_1.Prisma.Decimal(account.balance.toString());
            let newBalance;
            if (type === 'DEBIT') {
                if (currentBalance.lt(decimalAmount)) {
                    throw new shared_1.InsufficientBalanceError(id);
                }
                newBalance = currentBalance.minus(decimalAmount);
            }
            else {
                newBalance = currentBalance.plus(decimalAmount);
            }
            const updated = await tx.account.update({
                where: { id },
                data: { balance: newBalance },
            });
            logger.info({ accountId: id, previousBalance: currentBalance.toString(), newBalance: newBalance.toString(), type }, 'Balance updated');
            return updated;
        });
        return decryptAccount(result);
    }
    async getBalance(id) {
        const account = await repository_1.prisma.account.findUnique({
            where: { id },
            select: { balance: true },
        });
        if (!account) {
            throw new shared_1.NotFoundError('Account', id);
        }
        return account.balance.toString();
    }
}
exports.AccountService = AccountService;
exports.accountService = new AccountService();
//# sourceMappingURL=service.js.map