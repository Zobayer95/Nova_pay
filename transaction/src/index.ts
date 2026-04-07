import express from 'express';
import { register } from 'prom-client';
import {
  createLogger,
  requestIdMiddleware,
  requestLogger,
  errorHandler,
  createMetricsMiddleware,
} from '@novapay/shared';
import { router } from './routes';

const logger = createLogger('transaction-service');

const app = express();
const PORT = parseInt(process.env['PORT'] ?? '3002', 10);

app.use(express.json());
app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(createMetricsMiddleware('transaction'));

app.use('/', router);

app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (error) {
    res.status(500).end();
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Transaction service started');
});

export { app };
