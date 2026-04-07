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

const logger = createLogger('admin-service');

const app = express();

app.use(express.json());
app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(createMetricsMiddleware('admin'));

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

const PORT = parseInt(process.env['PORT'] ?? '3006', 10);

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Admin service started');
});

export { app };
