"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const prisma_1 = require("../generated/prisma");
const shared_1 = require("@novapay/shared");
const logger = (0, shared_1.createLogger)('account-repository');
const prisma = new prisma_1.PrismaClient({
    log: [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
    ],
});
exports.prisma = prisma;
prisma.$on('error', (e) => {
    logger.error({ message: e.message, target: e.target }, 'Prisma error');
});
prisma.$on('warn', (e) => {
    logger.warn({ message: e.message, target: e.target }, 'Prisma warning');
});
//# sourceMappingURL=repository.js.map