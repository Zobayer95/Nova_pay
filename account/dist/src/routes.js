"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const shared_1 = require("@novapay/shared");
const service_1 = require("./service");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'account' });
});
router.post('/accounts', (0, shared_1.validateBody)(shared_1.CreateAccountSchema), async (req, res, next) => {
    try {
        const account = await service_1.accountService.createAccount(req.body);
        res.status(201).json(account);
    }
    catch (err) {
        if (err instanceof Error &&
            'code' in err &&
            err['code'] === 'P2002') {
            res.status(409).json({
                error: shared_1.ErrorCode.DUPLICATE_KEY,
                message: 'Account already exists for this user and currency',
                requestId: req.requestId,
            });
            return;
        }
        next(err);
    }
});
router.get('/accounts/:id', async (req, res, next) => {
    try {
        const account = await service_1.accountService.getAccount(req.params['id']);
        res.json(account);
    }
    catch (err) {
        next(err);
    }
});
router.get('/accounts/user/:userId', async (req, res, next) => {
    try {
        const accounts = await service_1.accountService.getAccountsByUser(req.params['userId']);
        res.json(accounts);
    }
    catch (err) {
        next(err);
    }
});
router.post('/accounts/:id/balance', async (req, res, next) => {
    try {
        const { amount, type } = req.body;
        if (!amount || !type) {
            res.status(400).json({
                error: shared_1.ErrorCode.VALIDATION_ERROR,
                message: 'amount and type (CREDIT|DEBIT) are required',
                requestId: req.requestId,
            });
            return;
        }
        if (type !== 'CREDIT' && type !== 'DEBIT') {
            res.status(400).json({
                error: shared_1.ErrorCode.VALIDATION_ERROR,
                message: 'type must be CREDIT or DEBIT',
                requestId: req.requestId,
            });
            return;
        }
        const account = await service_1.accountService.updateBalance(req.params['id'], amount, type);
        res.json(account);
    }
    catch (err) {
        if (err instanceof shared_1.AppError) {
            next(err);
            return;
        }
        next(err);
    }
});
//# sourceMappingURL=routes.js.map