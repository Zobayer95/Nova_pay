import { Queue } from 'bullmq';
import IORedis from 'ioredis';
declare const QUEUE_NAME = "payroll-processing";
declare function createRedisConnection(): IORedis;
declare const payrollQueue: Queue<any, any, string, any, any, string>;
export { payrollQueue, QUEUE_NAME, createRedisConnection };
//# sourceMappingURL=queue.d.ts.map