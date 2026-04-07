"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const shared_1 = require("@novapay/shared");
const service_1 = require("./service");
const recovery_1 = require("./recovery");
const router = (0, express_1.Router)();
exports.router = router;
router.post('/disburse', (0, shared_1.validateBody)(shared_1.DisbursementSchema), async (req, res, next) => {
    try {
        const result = await service_1.transactionService.disburse(req.body);
        res.status(result.statusCode).json(result.body);
    }
    catch (error) {
        next(error);
    }
});
router.get('/transactions/:id', async (req, res, next) => {
    try {
        const result = await service_1.transactionService.getTransactionById(req.params['id']);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
router.get('/transactions/key/:idempotencyKey', async (req, res, next) => {
    try {
        const result = await service_1.transactionService.getTransactionByIdempotencyKey(req.params['idempotencyKey']);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
router.post('/transactions/:id/reverse', async (req, res, next) => {
    try {
        const result = await service_1.transactionService.reverseTransaction(req.params['id']);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
router.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'transaction', timestamp: new Date().toISOString() });
});
router.get('/recovery/stalled', async (_req, res, next) => {
    try {
        const stalledIds = await (0, recovery_1.scanStalledTransactions)();
        res.json({ stalledTransactions: stalledIds, count: stalledIds.length });
    }
    catch (error) {
        next(error);
    }
});
router.post('/recovery/run', async (_req, res, next) => {
    try {
        const results = await (0, recovery_1.runRecoveryCycle)();
        res.json({ results, count: results.length });
    }
    catch (error) {
        next(error);
    }
});
router.post('/recovery/:id', async (req, res, next) => {
    try {
        const result = await (0, recovery_1.recoverTransaction)(req.params['id']);
        res.json(result);
    }
    catch (error) {
        if (error instanceof shared_1.AppError) {
            next(error);
            return;
        }
        next(error);
    }
});
//# sourceMappingURL=routes.js.map