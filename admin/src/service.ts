import axios, { AxiosInstance } from 'axios';
import { createLogger } from '@novapay/shared';

const logger = createLogger('admin-service');

interface ServiceHealthStatus {
  service: string;
  status: 'ok' | 'error';
  responseTimeMs: number;
  error?: string;
}

interface AggregatedHealthStatus {
  status: 'ok' | 'degraded' | 'down';
  services: ServiceHealthStatus[];
  timestamp: string;
}

interface LedgerInvariantResult {
  valid: boolean;
  details: unknown;
}

interface StalledTransaction {
  id: string;
  status: string;
  stalledSince: string;
  [key: string]: unknown;
}

interface RecoveryResult {
  transactionId: string;
  status: string;
  [key: string]: unknown;
}

interface PayrollJobSummary {
  id: string;
  status: string;
  totalItems: number;
  processedItems: number;
  failedItems: number;
  [key: string]: unknown;
}

interface ServiceEndpoint {
  name: string;
  url: string;
}

export class AdminService {
  private readonly httpClient: AxiosInstance;
  private readonly serviceEndpoints: ServiceEndpoint[];

  private readonly ledgerServiceUrl: string;
  private readonly transactionServiceUrl: string;
  private readonly payrollServiceUrl: string;

  constructor() {
    this.ledgerServiceUrl =
      process.env['LEDGER_SERVICE_URL'] ?? 'http://ledger-service:3003';
    this.transactionServiceUrl =
      process.env['TRANSACTION_SERVICE_URL'] ?? 'http://transaction-service:3002';
    const accountServiceUrl =
      process.env['ACCOUNT_SERVICE_URL'] ?? 'http://account-service:3001';
    const fxServiceUrl =
      process.env['FX_SERVICE_URL'] ?? 'http://fx-service:3004';
    this.payrollServiceUrl =
      process.env['PAYROLL_SERVICE_URL'] ?? 'http://payroll-service:3005';

    this.httpClient = axios.create({
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

  async checkAllHealth(): Promise<AggregatedHealthStatus> {
    const results = await Promise.allSettled(
      this.serviceEndpoints.map(async (endpoint) => {
        const start = Date.now();
        try {
          await this.httpClient.get(`${endpoint.url}/health`);
          return {
            service: endpoint.name,
            status: 'ok' as const,
            responseTimeMs: Date.now() - start,
          };
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : 'Unknown error';
          logger.warn(
            { service: endpoint.name, error: errorMessage },
            'Health check failed',
          );
          return {
            service: endpoint.name,
            status: 'error' as const,
            responseTimeMs: Date.now() - start,
            error: errorMessage,
          };
        }
      }),
    );

    const services: ServiceHealthStatus[] = results.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
      return {
        service: 'unknown',
        status: 'error' as const,
        responseTimeMs: 0,
        error: 'Promise rejected unexpectedly',
      };
    });

    const errorCount = services.filter((s) => s.status === 'error').length;
    let overallStatus: AggregatedHealthStatus['status'] = 'ok';
    if (errorCount === services.length) {
      overallStatus = 'down';
    } else if (errorCount > 0) {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      services,
      timestamp: new Date().toISOString(),
    };
  }

  async checkLedgerInvariant(): Promise<LedgerInvariantResult> {
    const response = await this.httpClient.get<LedgerInvariantResult>(
      `${this.ledgerServiceUrl}/invariant-check`,
    );
    return response.data;
  }

  async getStalledTransactions(): Promise<StalledTransaction[]> {
    const response = await this.httpClient.get<StalledTransaction[]>(
      `${this.transactionServiceUrl}/transactions/stalled`,
    );
    return response.data;
  }

  async recoverTransaction(id: string): Promise<RecoveryResult> {
    const response = await this.httpClient.post<RecoveryResult>(
      `${this.transactionServiceUrl}/transactions/${id}/reverse`,
    );
    return response.data;
  }

  async getPayrollJobs(): Promise<PayrollJobSummary[]> {
    const response = await this.httpClient.get<PayrollJobSummary[]>(
      `${this.payrollServiceUrl}/payroll/jobs`,
    );
    return response.data;
  }
}

export const adminService = new AdminService();
