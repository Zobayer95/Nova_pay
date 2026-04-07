# NovaPay Transaction Backend

A robust, scalable financial transaction backend built to handle high-throughput money movements with full double-entry bookkeeping, idempotent disbursements, and strict FX rate management.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     API Gateway (:3000)                  │
│              Rate Limiting · Request Routing             │
└──────┬──────┬──────┬──────┬──────┬──────┬───────────────┘
       │      │      │      │      │      │
  ┌────┴─┐ ┌──┴──┐ ┌─┴──┐ ┌┴───┐ ┌┴────┐ ┌┴────┐
  │Acct  │ │Txn  │ │Ldgr│ │ FX │ │Pay  │ │Admin│
  │:3001 │ │:3002│ │:3003│ │:3004│ │:3005│ │:3006│
  └──┬───┘ └──┬──┘ └─┬──┘ └┬───┘ └┬────┘ └┬────┘
     │        │      │     │      │       │
  ┌──┴──┐ ┌──┴──┐ ┌─┴──┐ ┌┴──┐  ┌┴──┐   │
  │PG   │ │PG   │ │PG  │ │PG │  │PG │   │
  └─────┘ └─────┘ └────┘ └───┘  └───┘   │
                                         │
              ┌──────────┐               │
              │  Redis   │◄──────────────┘
              │ Locks/Q  │
              └──────────┘
```

Each service has its own PostgreSQL database. Redis is shared for distributed locking, BullMQ job queues, and idempotency key management.

## Core Services

| Service | Port | Responsibility |
|---------|------|----------------|
| **API Gateway** | 3000 | Single entry point, rate limiting, request routing |
| **Account Service** | 3001 | User wallets, balance management, field-level encryption |
| **Transaction Service** | 3002 | Idempotent disbursements, concurrency control, crash recovery |
| **Ledger Service** | 3003 | Double-entry bookkeeping, audit hash chain, invariant checks |
| **FX Service** | 3004 | Rate quotes with 60s TTL, single-use validation |
| **Payroll Service** | 3005 | Bulk disbursements via BullMQ, checkpoint/resume |
| **Admin Service** | 3006 | Operations panel, health aggregation, incident response |

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)

### Run with Docker Compose

```bash
# Clone the repository
git clone <repository-url>
cd novapay

# Copy environment file
cp .env.example .env

# Start all services
docker compose up --build
```

The API gateway will be available at `http://localhost:3000`.

### Local Development

```bash
# Install dependencies
npm install

# Build shared package first
npm run build --workspace=packages/shared

# Run a specific service in dev mode
npm run dev:account
npm run dev:transaction
npm run dev:ledger
npm run dev:fx
npm run dev:payroll
npm run dev:admin
npm run dev:gateway
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests for a specific service
npm run test --workspace=services/ledger
npm run test --workspace=services/transaction
```

## API Endpoints

All endpoints are accessed through the gateway at `http://localhost:3000`.

### Accounts
```
POST   /api/accounts                    Create account
GET    /api/accounts/:id                Get account
GET    /api/accounts/user/:userId       Get user accounts
```

### Transactions
```
POST   /api/disburse                    Process disbursement (idempotent)
GET    /api/transactions/:id            Get transaction
GET    /api/transactions/key/:key       Get by idempotency key
POST   /api/transactions/:id/reverse    Reverse transaction
```

### FX Quotes
```
POST   /api/fx/quotes                   Create rate quote (60s TTL)
GET    /api/fx/quotes/:id               Get quote
POST   /api/fx/quotes/:id/consume       Consume quote (single-use)
GET    /api/fx/rates/:source/:target    Get current rate
```

### Payroll
```
POST   /api/payroll/submit              Submit bulk payroll job
GET    /api/payroll/jobs/:id            Get job status
GET    /api/payroll/jobs/:id/items      Get job items (paginated)
POST   /api/payroll/jobs/:id/pause      Pause job
POST   /api/payroll/jobs/:id/resume     Resume job
```

### Admin
```
GET    /api/admin/health                Aggregated service health
GET    /api/admin/ledger/invariant      Check ledger invariant
GET    /api/admin/transactions/stalled  List stalled transactions
POST   /api/admin/transactions/:id/recover  Recover stalled transaction
```

## Key Features

### Idempotent Disbursements
Every disbursement requires an `idempotencyKey`. The system guarantees:
- **Deduplication:** Same key + same payload = cached response returned
- **Conflict detection:** Same key + different payload = 409 error
- **Concurrency control:** Multiple simultaneous requests with the same key — only one processes
- **Crash recovery:** Partial transactions are detected and reversed automatically
- **Key expiry:** Keys expire after 24 hours

### Double-Entry Ledger
Every money movement creates paired DEBIT/CREDIT entries. The system continuously verifies that total debits equal total credits. Any violation triggers an immediate critical alert.

### Audit Hash Chain
Each ledger entry includes a hash computed from the previous entry's hash, creating an immutable chain that detects any tampering with historical records.

### FX Rate Quotes
Rate quotes are locked for 60 seconds and are single-use. The system never applies stale rates silently — if a quote expires, the transfer is refused.

### Bulk Payroll
Payroll jobs are processed asynchronously via BullMQ with:
- Concurrency limited to 1 per employer account
- Checkpoint pattern for resumability
- Individual item failure isolation

### Field-Level Encryption
Sensitive data (names, emails) is encrypted using envelope encryption (AES-256-GCM) before database writes. Raw values never appear in logs.

## Observability

### Metrics
Each service exposes Prometheus metrics at `/metrics`. Grafana dashboards are available at `http://localhost:3100`.

Key metrics monitored:
- `ledger_invariant_violations_total` — Critical alert if > 0
- `transactions_total{status}` — Transaction throughput by status
- `http_request_duration_seconds` — p95/p99 latency
- `fx_quotes_expired_total` — FX quote expiry rate
- `payroll_items_processed_total` — Payroll processing throughput

### Logging
Structured JSON logs with mandatory fields: `requestId`, `userId`, `transactionId`, `timestamp`. Sensitive fields are automatically redacted.

### Alerting
Prometheus alerts configured for:
- Ledger invariant violations (immediate)
- High transaction failure rate (> 5% over 5 minutes)
- FX provider errors
- High p99 latency (> 5 seconds)
- Stalled payroll jobs

## CI/CD

GitHub Actions pipeline with selective builds — only services with changed files are built and tested. The pipeline:
1. Detects which services have changes (via path filters)
2. Builds and tests the shared package
3. Builds, lints, and tests each changed service in parallel
4. Builds Docker images on main branch merges

## Project Structure

```
novapay/
├── packages/
│   └── shared/              # Shared types, encryption, logging, middleware
├── services/
│   ├── gateway/             # API Gateway
│   ├── account/             # Account Service
│   ├── transaction/         # Transaction Service
│   ├── ledger/              # Ledger Service
│   ├── fx/                  # FX Service
│   ├── payroll/             # Payroll Service
│   └── admin/               # Admin Service
├── infrastructure/
│   ├── prometheus.yml       # Prometheus configuration
│   └── alerts.yml           # Alert rules
├── docker-compose.yml       # Full system deployment
├── decisions.md             # Architectural decisions
└── .github/workflows/ci.yml # CI/CD pipeline
```

## Design Decisions

See [decisions.md](./decisions.md) for detailed explanations of architectural choices, including idempotency handling, ledger design, FX management, and encryption strategy.
