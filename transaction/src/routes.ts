import { Router, Request, Response, NextFunction } from 'express';
import { DisbursementSchema, validateBody, AppError } from '@novapay/shared';
import { transactionService } from './service';
import { scanStalledTransactions, recoverTransaction, runRecoveryCycle } from './recovery';

const router = Router();

router.post(
  '/disburse',
  validateBody(DisbursementSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await transactionService.disburse(req.body);
      res.status(result.statusCode).json(result.body);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/transactions/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await transactionService.getTransactionById(req.params['id']!);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/transactions/key/:idempotencyKey',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await transactionService.getTransactionByIdempotencyKey(req.params['idempotencyKey']!);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/transactions/:id/reverse',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await transactionService.reverseTransaction(req.params['id']!);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

router.get('/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok', service: 'transaction', timestamp: new Date().toISOString() });
});

router.get(
  '/recovery/stalled',
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stalledIds = await scanStalledTransactions();
      res.json({ stalledTransactions: stalledIds, count: stalledIds.length });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/recovery/run',
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const results = await runRecoveryCycle();
      res.json({ results, count: results.length });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/recovery/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await recoverTransaction(req.params['id']!);
      res.json(result);
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
        return;
      }
      next(error);
    }
  },
);

export { router };
