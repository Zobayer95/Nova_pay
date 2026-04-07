import { Router, Request, Response, NextFunction } from 'express';
import { PayrollSubmitSchema, validateBody } from '@novapay/shared';
import { payrollService } from './service';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'payroll', timestamp: new Date().toISOString() });
});

router.post(
  '/payroll/submit',
  validateBody(PayrollSubmitSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await payrollService.submitJob(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/payroll/jobs/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await payrollService.getJobStatus(req.params['id'] as string);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/payroll/jobs/:id/items',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query['page'] as string, 10) || 1;
      const limit = parseInt(req.query['limit'] as string, 10) || 50;
      const result = await payrollService.getJobItems(
        req.params['id'] as string,
        page,
        limit,
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  '/payroll/jobs/:id/pause',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await payrollService.pauseJob(req.params['id'] as string);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  '/payroll/jobs/:id/resume',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await payrollService.resumeJob(req.params['id'] as string);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
