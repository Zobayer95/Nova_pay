import { Router, Request, Response, RequestHandler } from 'express';
import {
  createProxyMiddleware,
  Options,
  fixRequestBody,
} from 'http-proxy-middleware';
import { createLogger } from '@novapay/shared';
import {
  sensitiveEndpointLimiter,
  disburseRateLimiter,
  payrollSubmitRateLimiter,
} from './rate-limiter';

const logger = createLogger('gateway-routes');

const ACCOUNT_SERVICE_URL =
  process.env['ACCOUNT_SERVICE_URL'] ?? 'http://account-service:3001';
const TRANSACTION_SERVICE_URL =
  process.env['TRANSACTION_SERVICE_URL'] ?? 'http://transaction-service:3002';
const LEDGER_SERVICE_URL =
  process.env['LEDGER_SERVICE_URL'] ?? 'http://ledger-service:3003';
const FX_SERVICE_URL =
  process.env['FX_SERVICE_URL'] ?? 'http://fx-service:3004';
const PAYROLL_SERVICE_URL =
  process.env['PAYROLL_SERVICE_URL'] ?? 'http://payroll-service:3005';
const ADMIN_SERVICE_URL =
  process.env['ADMIN_SERVICE_URL'] ?? 'http://admin-service:3006';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'gateway' });
});

function createProxy(
  target: string,
  pathRewrite: Record<string, string>,
): RequestHandler {
  const options: Options = {
    target,
    changeOrigin: true,
    pathRewrite,
    on: {
      proxyReq: (proxyReq, req) => {
        const expressReq = req as Request;
        if (expressReq.requestId) {
          proxyReq.setHeader('x-request-id', expressReq.requestId);
        }
        fixRequestBody(proxyReq, req);
      },
      error: (err, _req, res) => {
        logger.error({ error: err.message }, 'Proxy error');
        if ('writeHead' in res && typeof res.writeHead === 'function') {
          const httpRes = res as Response;
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
  return createProxyMiddleware(options) as RequestHandler;
}

// Stricter rate limits for sensitive endpoints
router.use('/api/disburse', disburseRateLimiter);
router.use('/api/payroll/submit', payrollSubmitRateLimiter);

// Proxy routes
router.use(
  '/api/accounts',
  sensitiveEndpointLimiter,
  createProxy(ACCOUNT_SERVICE_URL, { '^/api/accounts': '/accounts' }),
);

router.use(
  '/api/disburse',
  createProxy(TRANSACTION_SERVICE_URL, { '^/api/disburse': '/disburse' }),
);

router.use(
  '/api/transactions',
  sensitiveEndpointLimiter,
  createProxy(TRANSACTION_SERVICE_URL, {
    '^/api/transactions': '/transactions',
  }),
);

router.use(
  '/api/ledger',
  createProxy(LEDGER_SERVICE_URL, { '^/api/ledger': '/ledger' }),
);

router.use(
  '/api/fx',
  createProxy(FX_SERVICE_URL, { '^/api/fx': '/fx' }),
);

router.use(
  '/api/payroll/submit',
  createProxy(PAYROLL_SERVICE_URL, { '^/api/payroll': '/payroll' }),
);

router.use(
  '/api/payroll',
  createProxy(PAYROLL_SERVICE_URL, { '^/api/payroll': '/payroll' }),
);

router.use(
  '/api/admin',
  createProxy(ADMIN_SERVICE_URL, { '^/api/admin': '/admin' }),
);

export { router };
