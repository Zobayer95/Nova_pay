"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const prom_client_1 = require("prom-client");
const shared_1 = require("@novapay/shared");
const routes_1 = require("./routes");
const logger = (0, shared_1.createLogger)('account-service');
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use(shared_1.requestIdMiddleware);
app.use(shared_1.requestLogger);
app.use((0, shared_1.createMetricsMiddleware)('account'));
app.get('/metrics', async (_req, res) => {
    try {
        res.set('Content-Type', prom_client_1.register.contentType);
        res.end(await prom_client_1.register.metrics());
    }
    catch (err) {
        res.status(500).end(String(err));
    }
});
app.use(routes_1.router);
app.use(shared_1.errorHandler);
const PORT = parseInt(process.env['PORT'] ?? '3001', 10);
app.listen(PORT, () => {
    logger.info({ port: PORT }, 'Account service started');
});
//# sourceMappingURL=index.js.map