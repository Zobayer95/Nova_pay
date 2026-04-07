import { Router, Request, Response, NextFunction } from 'express';
import {
  CreateAccountSchema,
  validateBody,
  AppError,
  ErrorCode,
} from '@novapay/shared';
import { accountService } from './service';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'account' });
});

router.post(
  '/accounts',
  validateBody(CreateAccountSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const account = await accountService.createAccount(req.body);
      res.status(201).json(account);
    } catch (err) {
      if (
        err instanceof Error &&
        'code' in err &&
        (err as Record<string, unknown>)['code'] === 'P2002'
      ) {
        res.status(409).json({
          error: ErrorCode.DUPLICATE_KEY,
          message: 'Account already exists for this user and currency',
          requestId: req.requestId,
        });
        return;
      }
      next(err);
    }
  },
);

router.get(
  '/accounts/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const account = await accountService.getAccount(req.params['id']!);
      res.json(account);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/accounts/user/:userId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accounts = await accountService.getAccountsByUser(req.params['userId']!);
      res.json(accounts);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  '/accounts/:id/balance',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount, type } = req.body as { amount: string; type: 'CREDIT' | 'DEBIT' };

      if (!amount || !type) {
        res.status(400).json({
          error: ErrorCode.VALIDATION_ERROR,
          message: 'amount and type (CREDIT|DEBIT) are required',
          requestId: req.requestId,
        });
        return;
      }

      if (type !== 'CREDIT' && type !== 'DEBIT') {
        res.status(400).json({
          error: ErrorCode.VALIDATION_ERROR,
          message: 'type must be CREDIT or DEBIT',
          requestId: req.requestId,
        });
        return;
      }

      const account = await accountService.updateBalance(req.params['id']!, amount, type);
      res.json(account);
    } catch (err) {
      if (err instanceof AppError) {
        next(err);
        return;
      }
      next(err);
    }
  },
);

export { router };
