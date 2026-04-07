import { Queue, QueueOptions } from 'bullmq';
import IORedis from 'ioredis';

const QUEUE_NAME = 'payroll-processing';

function createRedisConnection(): IORedis {
  const redisUrl = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
  return new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
  });
}

const defaultJobOptions: QueueOptions['defaultJobOptions'] = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
  removeOnComplete: 1000,
  removeOnFail: 5000,
};

const connection = createRedisConnection();

const payrollQueue = new Queue(QUEUE_NAME, {
  connection,
  defaultJobOptions,
});

export { payrollQueue, QUEUE_NAME, createRedisConnection };
