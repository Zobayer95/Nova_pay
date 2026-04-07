import { Router, Request, Response, NextFunction } from 'express';
import { register } from 'prom-client';
import { adminService } from './service';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'admin' });
});

router.get(
  '/admin/health',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const health = await adminService.checkAllHealth();
      const statusCode = health.status === 'ok' ? 200 : 503;
      res.status(statusCode).json(health);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/admin/ledger/invariant',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await adminService.checkLedgerInvariant();
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/admin/transactions/stalled',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stalled = await adminService.getStalledTransactions();
      res.json(stalled);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  '/admin/transactions/:id/recover',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await adminService.recoverTransaction(req.params['id']!);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/admin/payroll/jobs',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const jobs = await adminService.getPayrollJobs();
      res.json(jobs);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/admin/metrics',
  async (_req: Request, res: Response) => {
    try {
      const metrics = await register.getMetricsAsJSON();
      res.json({
        service: 'admin',
        metrics,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      res.status(500).json({
        error: 'Failed to collect metrics',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  },
);

export { router };
