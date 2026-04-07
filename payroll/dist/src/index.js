"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shared_1 = require("@novapay/shared");
const prom_client_1 = require("prom-client");
const routes_1 = __importDefault(require("./routes"));
const worker_1 = require("./worker");
const logger = (0, shared_1.createLogger)('payroll');
const PORT = parseInt(process.env['PORT'] ?? '3005', 10);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(shared_1.requestIdMiddleware);
app.use(shared_1.requestLogger);
app.use((0, shared_1.createMetricsMiddleware)('payroll'));
app.use(routes_1.default);
app.get('/metrics', async (_req, res) => {
    try {
        res.set('Content-Type', prom_client_1.register.contentType);
        res.end(await prom_client_1.register.metrics());
    }
    catch (err) {
        res.status(500).end(String(err));
    }
});
app.use(shared_1.errorHandler);
app.listen(PORT, () => {
    logger.info({ port: PORT }, 'Payroll service started');
});
(0, worker_1.startWorker)();
exports.default = app;
//# sourceMappingURL=index.js.map