"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const prom_client_1 = require("prom-client");
const service_1 = require("./service");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'admin' });
});
router.get('/admin/health', async (_req, res, next) => {
    try {
        const health = await service_1.adminService.checkAllHealth();
        const statusCode = health.status === 'ok' ? 200 : 503;
        res.status(statusCode).json(health);
    }
    catch (err) {
        next(err);
    }
});
router.get('/admin/ledger/invariant', async (_req, res, next) => {
    try {
        const result = await service_1.adminService.checkLedgerInvariant();
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
router.get('/admin/transactions/stalled', async (_req, res, next) => {
    try {
        const stalled = await service_1.adminService.getStalledTransactions();
        res.json(stalled);
    }
    catch (err) {
        next(err);
    }
});
router.post('/admin/transactions/:id/recover', async (req, res, next) => {
    try {
        const result = await service_1.adminService.recoverTransaction(req.params['id']);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
router.get('/admin/payroll/jobs', async (_req, res, next) => {
    try {
        const jobs = await service_1.adminService.getPayrollJobs();
        res.json(jobs);
    }
    catch (err) {
        next(err);
    }
});
router.get('/admin/metrics', async (_req, res) => {
    try {
        const metrics = await prom_client_1.register.getMetricsAsJSON();
        res.json({
            service: 'admin',
            metrics,
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        res.status(500).json({
            error: 'Failed to collect metrics',
            message: err instanceof Error ? err.message : 'Unknown error',
        });
    }
});
//# sourceMappingURL=routes.js.map