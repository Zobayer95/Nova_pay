import express, { Request, Response } from 'express';
import {
  createLogger,
  requestIdMiddleware,
  requestLogger,
  errorHandler,
  createMetricsMiddleware,
} from '@novapay/shared';
import { register } from 'prom-client';
import router from './routes';
import { startWorker } from './worker';

const logger = createLogger('payroll');
const PORT = parseInt(process.env['PORT'] ?? '3005', 10);

const app = express();

app.use(express.json());
app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(createMetricsMiddleware('payroll'));

app.use(router);

app.get('/metrics', async (_req: Request, res: Response) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(String(err));
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Payroll service started');
});

startWorker();

export default app;
