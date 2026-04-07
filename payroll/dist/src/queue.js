"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUEUE_NAME = exports.payrollQueue = void 0;
exports.createRedisConnection = createRedisConnection;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const QUEUE_NAME = 'payroll-processing';
exports.QUEUE_NAME = QUEUE_NAME;
function createRedisConnection() {
    const redisUrl = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
    return new ioredis_1.default(redisUrl, {
        maxRetriesPerRequest: null,
    });
}
const defaultJobOptions = {
    attempts: 3,
    backoff: {
        type: 'exponential',
        delay: 1000,
    },
    removeOnComplete: 1000,
    removeOnFail: 5000,
};
const connection = createRedisConnection();
const payrollQueue = new bullmq_1.Queue(QUEUE_NAME, {
    connection,
    defaultJobOptions,
});
exports.payrollQueue = payrollQueue;
//# sourceMappingURL=queue.js.map