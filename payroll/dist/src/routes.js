"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shared_1 = require("@novapay/shared");
const service_1 = require("./service");
const router = (0, express_1.Router)();
router.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'payroll', timestamp: new Date().toISOString() });
});
router.post('/payroll/submit', (0, shared_1.validateBody)(shared_1.PayrollSubmitSchema), async (req, res, next) => {
    try {
        const result = await service_1.payrollService.submitJob(req.body);
        res.status(201).json(result);
    }
    catch (err) {
        next(err);
    }
});
router.get('/payroll/jobs/:id', async (req, res, next) => {
    try {
        const result = await service_1.payrollService.getJobStatus(req.params['id']);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
router.get('/payroll/jobs/:id/items', async (req, res, next) => {
    try {
        const page = parseInt(req.query['page'], 10) || 1;
        const limit = parseInt(req.query['limit'], 10) || 50;
        const result = await service_1.payrollService.getJobItems(req.params['id'], page, limit);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
router.post('/payroll/jobs/:id/pause', async (req, res, next) => {
    try {
        const result = await service_1.payrollService.pauseJob(req.params['id']);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
router.post('/payroll/jobs/:id/resume', async (req, res, next) => {
    try {
        const result = await service_1.payrollService.resumeJob(req.params['id']);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=routes.js.map