"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = exports.AdminService = void 0;
const axios_1 = __importDefault(require("axios"));
const shared_1 = require("@novapay/shared");
const logger = (0, shared_1.createLogger)('admin-service');
class AdminService {
    httpClient;
    serviceEndpoints;
    ledgerServiceUrl;
    transactionServiceUrl;
    payrollServiceUrl;
    constructor() {
        this.ledgerServiceUrl =
            process.env['LEDGER_SERVICE_URL'] ?? 'http://ledger-service:3003';
        this.transactionServiceUrl =
            process.env['TRANSACTION_SERVICE_URL'] ?? 'http://transaction-service:3002';
        const accountServiceUrl = process.env['ACCOUNT_SERVICE_URL'] ?? 'http://account-service:3001';
        const fxServiceUrl = process.env['FX_SERVICE_URL'] ?? 'http://fx-service:3004';
        this.payrollServiceUrl =
            process.env['PAYROLL_SERVICE_URL'] ?? 'http://payroll-service:3005';
        this.httpClient = axios_1.default.create({
            timeout: 5000,
        });
        this.serviceEndpoints = [
            { name: 'account', url: accountServiceUrl },
            { name: 'transaction', url: this.transactionServiceUrl },
            { name: 'ledger', url: this.ledgerServiceUrl },
            { name: 'fx', url: fxServiceUrl },
            { name: 'payroll', url: this.payrollServiceUrl },
        ];
    }
    async checkAllHealth() {
        const results = await Promise.allSettled(this.serviceEndpoints.map(async (endpoint) => {
            const start = Date.now();
            try {
                await this.httpClient.get(`${endpoint.url}/health`);
                return {
                    service: endpoint.name,
                    status: 'ok',
                    responseTimeMs: Date.now() - start,
                };
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                logger.warn({ service: endpoint.name, error: errorMessage }, 'Health check failed');
                return {
                    service: endpoint.name,
                    status: 'error',
                    responseTimeMs: Date.now() - start,
                    error: errorMessage,
                };
            }
        }));
        const services = results.map((result) => {
            if (result.status === 'fulfilled') {
                return result.value;
            }
            return {
                service: 'unknown',
                status: 'error',
                responseTimeMs: 0,
                error: 'Promise rejected unexpectedly',
            };
        });
        const errorCount = services.filter((s) => s.status === 'error').length;
        let overallStatus = 'ok';
        if (errorCount === services.length) {
            overallStatus = 'down';
        }
        else if (errorCount > 0) {
            overallStatus = 'degraded';
        }
        return {
            status: overallStatus,
            services,
            timestamp: new Date().toISOString(),
        };
    }
    async checkLedgerInvariant() {
        const response = await this.httpClient.get(`${this.ledgerServiceUrl}/invariant-check`);
        return response.data;
    }
    async getStalledTransactions() {
        const response = await this.httpClient.get(`${this.transactionServiceUrl}/transactions/stalled`);
        return response.data;
    }
    async recoverTransaction(id) {
        const response = await this.httpClient.post(`${this.transactionServiceUrl}/transactions/${id}/reverse`);
        return response.data;
    }
    async getPayrollJobs() {
        const response = await this.httpClient.get(`${this.payrollServiceUrl}/payroll/jobs`);
        return response.data;
    }
}
exports.AdminService = AdminService;
exports.adminService = new AdminService();
//# sourceMappingURL=service.js.map