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
import { globalRateLimiter } from './rate-limiter';

const logger = createLogger('gateway');

const app = express();

app.use(express.json());
app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(createMetricsMiddleware('gateway'));
app.use(globalRateLimiter);

app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(String(err));
  }
});

app.use(router);
app.use(errorHandler);

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'API Gateway started');
});

export { app };
