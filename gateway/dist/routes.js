"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const shared_1 = require("@novapay/shared");
const rate_limiter_1 = require("./rate-limiter");
const logger = (0, shared_1.createLogger)('gateway-routes');
const ACCOUNT_SERVICE_URL = process.env['ACCOUNT_SERVICE_URL'] ?? 'http://account-service:3001';
const TRANSACTION_SERVICE_URL = process.env['TRANSACTION_SERVICE_URL'] ?? 'http://transaction-service:3002';
const LEDGER_SERVICE_URL = process.env['LEDGER_SERVICE_URL'] ?? 'http://ledger-service:3003';
const FX_SERVICE_URL = process.env['FX_SERVICE_URL'] ?? 'http://fx-service:3004';
const PAYROLL_SERVICE_URL = process.env['PAYROLL_SERVICE_URL'] ?? 'http://payroll-service:3005';
const ADMIN_SERVICE_URL = process.env['ADMIN_SERVICE_URL'] ?? 'http://admin-service:3006';
const router = (0, express_1.Router)();
exports.router = router;
router.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'gateway' });
});
function createProxy(target, pathRewrite) {
    const options = {
        target,
        changeOrigin: true,
        pathRewrite,
        on: {
            proxyReq: (proxyReq, req) => {
                const expressReq = req;
                if (expressReq.requestId) {
                    proxyReq.setHeader('x-request-id', expressReq.requestId);
                }
                (0, http_proxy_middleware_1.fixRequestBody)(proxyReq, req);
            },
            error: (err, _req, res) => {
                logger.error({ error: err.message }, 'Proxy error');
                if ('writeHead' in res && typeof res.writeHead === 'function') {
                    const httpRes = res;
                    if (!httpRes.headersSent) {
                        httpRes.status(502).json({
                            error: 'BAD_GATEWAY',
                            message: 'Upstream service unavailable',
                        });
                    }
                }
            },
        },
    };
    return (0, http_proxy_middleware_1.createProxyMiddleware)(options);
}
// Stricter rate limits for sensitive endpoints
router.use('/api/disburse', rate_limiter_1.disburseRateLimiter);
router.use('/api/payroll/submit', rate_limiter_1.payrollSubmitRateLimiter);
// Proxy routes
router.use('/api/accounts', rate_limiter_1.sensitiveEndpointLimiter, createProxy(ACCOUNT_SERVICE_URL, { '^/api/accounts': '/accounts' }));
router.use('/api/disburse', createProxy(TRANSACTION_SERVICE_URL, { '^/api/disburse': '/disburse' }));
router.use('/api/transactions', rate_limiter_1.sensitiveEndpointLimiter, createProxy(TRANSACTION_SERVICE_URL, {
    '^/api/transactions': '/transactions',
}));
router.use('/api/ledger', createProxy(LEDGER_SERVICE_URL, { '^/api/ledger': '/ledger' }));
router.use('/api/fx', createProxy(FX_SERVICE_URL, { '^/api/fx': '/fx' }));
router.use('/api/payroll/submit', createProxy(PAYROLL_SERVICE_URL, { '^/api/payroll': '/payroll' }));
router.use('/api/payroll', createProxy(PAYROLL_SERVICE_URL, { '^/api/payroll': '/payroll' }));
router.use('/api/admin', createProxy(ADMIN_SERVICE_URL, { '^/api/admin': '/admin' }));
//# sourceMappingURL=routes.js.map