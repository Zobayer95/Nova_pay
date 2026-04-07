# Architectural Decisions

This document explains the key architectural choices made in the NovaPay transaction backend rebuild.

---

## 1. Microservice Architecture with Isolated Databases

**Decision:** Each service owns its database — no shared databases between services.

**Rationale:** The previous system suffered from database performance collapses under load. Shared databases create contention hotspots, make independent scaling impossible, and couple service lifecycles. By isolating databases:
- Each service can be scaled independently based on its traffic profile
- Schema migrations in one service cannot break another
- Database connection pools are isolated, preventing one service from starving another
- We can choose different database tuning parameters per service (e.g., the ledger database is optimized for write-heavy append-only workloads)

**Trade-off:** Cross-service consistency requires careful choreography via API calls rather than database joins. We accept eventual consistency at the inter-service level while maintaining strong consistency within each service's boundary.

---

## 2. Double-Entry Ledger with Hash Chain

**Decision:** Every money movement produces at least two ledger entries (DEBIT + CREDIT), and each entry is linked via a SHA-256 hash chain.

**Rationale:**
- **Double-entry** ensures money is never created or destroyed — the system is zero-sum by construction. If total debits ≠ total credits, we have an invariant violation that triggers an immediate alert.
- **Hash chain** provides tamper detection. Each entry's hash is computed from `sha256(previousHash + entryData)`, creating an immutable audit trail. If any historical record is modified, the chain breaks and is detectable via the invariant check endpoint.
- We chose SHA-256 over HMAC because the threat model is internal tampering detection, not external authentication.

**Trade-off:** The hash chain adds latency to writes (must read the previous hash for the same account before writing). This is acceptable given the integrity guarantees it provides.

---

## 3. Idempotency Implementation

**Decision:** Three-layer idempotency using Redis distributed locks + database idempotency records + payload hash validation.

### Layer 1: Redis Distributed Lock
When a disbursement request arrives, we immediately attempt to acquire a Redis lock (`SET NX EX 30s`) on the idempotency key. This handles the **concurrency scenario** where three identical requests arrive within 100ms — only the first acquires the lock; others receive a 409 response.

### Layer 2: Database Idempotency Records
After processing, we store the idempotency key, payload hash, and response in the `IdempotencyRecord` table with a 24-hour TTL. Subsequent requests with the same key return the cached response (**deduplication**).

### Layer 3: Payload Hash Validation
We hash the payload (`sourceAccountId + destinationAccountId + amount + currency`) using SHA-256. If the same idempotency key arrives with a different payload hash, we return a 409 conflict error. This prevents the scenario where `key-abc` is sent first for $500, then again for $800.

### Key Expiry
Idempotency keys expire after 24 hours. After expiry, the same key can be reused for a new transaction. This balances deduplication safety with storage efficiency.

### Crash Recovery
If the server crashes between debiting the source and crediting the destination:
1. The transaction remains in `PROCESSING` status
2. A recovery mechanism scans for transactions stuck in `PROCESSING` for > 5 minutes
3. The recovery process either completes or reverses the transaction based on what state was persisted
4. The admin service provides endpoints to manually trigger recovery

---

## 4. FX Rate Management

**Decision:** Time-locked, single-use quotes with strict validation.

**Rationale:** The previous system applied stale or cached rates silently, leading to financial losses. Our approach:
- **60-second TTL:** Quotes expire after 60 seconds. The client must complete the transfer within this window. This balances user experience (enough time to confirm) with rate accuracy.
- **Single-use:** Each quote can only be consumed once, atomically (UPDATE WHERE used = false). This prevents a single rate lock from being applied to multiple transfers.
- **No silent fallback:** If the FX provider is unavailable or the quote has expired, the transfer is refused entirely. We never silently apply a stale rate.

**Trade-off:** Users may need to request a new quote if they take too long, adding friction. This is preferable to processing transfers at incorrect rates.

---

## 5. Bulk Payroll via BullMQ with Checkpoint Pattern

**Decision:** Process payroll jobs asynchronously via BullMQ with concurrency limited to 1 per employer account.

**Rationale:**
- **Queue-based processing:** A bulk payroll job with 14,000 credits cannot be processed synchronously. BullMQ provides reliable job processing with retry logic, dead-letter handling, and observability.
- **Concurrency 1 per employer:** Since each disbursement debits the employer's account, concurrent processing would create race conditions on the balance. By processing one at a time per employer (using a Redis lock keyed to the employer account), we ensure balance consistency without complex distributed transaction protocols.
- **Checkpoint pattern:** After each item is processed, we save the checkpoint (last successfully processed index). If the job is paused, fails, or the worker crashes, it resumes from the checkpoint rather than reprocessing from the beginning. This is critical for large jobs — reprocessing 10,000 items because item 10,001 failed is unacceptable.
- **Item-level failure isolation:** Individual item failures are recorded but don't halt the entire job. The employer gets a complete report showing which payments succeeded and which failed.

---

## 6. Envelope Encryption for Sensitive Data

**Decision:** Two-key hierarchy (Master Key → Data Encryption Keys) with AES-256-GCM.

**Rationale:**
- **Field-level encryption:** Sensitive fields (name, email) are encrypted before database writes. This means even database administrators or backup theft cannot expose PII.
- **Envelope encryption:** Each encryption operation generates a unique Data Encryption Key (DEK). The DEK encrypts the data, then the DEK itself is encrypted with the Master Key. This means:
  - Rotating the master key only requires re-encrypting the DEKs, not all data
  - Each field has a unique key, limiting the blast radius of any key compromise
  - The master key never directly touches plaintext data
- **AES-256-GCM:** Provides both confidentiality and authenticity. The auth tag detects any tampering with the ciphertext.
- **Redacted logging:** The logger is configured to redact sensitive fields, ensuring raw values never appear in logs.

---

## 7. Observability Stack

**Decision:** Prometheus + Grafana for metrics, structured JSON logging with mandatory context fields.

**Rationale:**
- **Prometheus metrics:** Each service exposes a `/metrics` endpoint. Key metrics include request throughput, latency histograms (p95/p99), error rates, and domain-specific counters (ledger violations, FX quote expiry, payroll progress).
- **Critical alerting:** The most important alert is `ledger_invariant_violations_total > 0`. This fires immediately (0m `for` duration) because any ledger imbalance indicates money was created or destroyed — a critical financial integrity failure.
- **Structured logging:** Every log line includes `requestId`, `userId`, `transactionId`, and ISO timestamp. This enables end-to-end request tracing across services via the `x-request-id` header propagated through the API gateway.

---

## 8. API Gateway Pattern

**Decision:** Single API gateway (Express + http-proxy-middleware) with rate limiting.

**Rationale:**
- **Single entry point:** All external traffic enters through the gateway on port 3000. Internal services are not directly accessible from outside the Docker network.
- **Rate limiting:** Global limit of 1,000 req/s (matching the traffic burst requirement) with stricter per-IP limits on sensitive endpoints (disbursement, payroll submission).
- **Request ID propagation:** The gateway assigns a `x-request-id` to every request, enabling end-to-end tracing.
- We chose Express + http-proxy-middleware over dedicated API gateways (Kong, Traefik) to keep the system self-contained and reduce operational complexity for the rebuild timeline.

---

## 9. Technology Choices

| Component | Choice | Reason |
|-----------|--------|--------|
| Runtime | Node.js 20 | Team expertise, async I/O model suits high-throughput API workloads |
| Language | TypeScript (strict) | Type safety prevents entire classes of runtime errors in financial code |
| HTTP Framework | Express | Mature, well-understood, extensive middleware ecosystem |
| ORM | Prisma | Type-safe queries, migration management, connection pooling |
| Queue | BullMQ | Redis-backed, reliable, supports concurrency control and checkpointing |
| Cache/Lock | Redis | Low-latency distributed locking for idempotency and rate limiting |
| Metrics | prom-client + Prometheus | Industry standard, integrates with Grafana for visualization |
| Encryption | Node.js crypto | No external dependencies, AES-256-GCM is well-supported |
| Validation | Zod | Runtime type validation with TypeScript type inference |
| Container | Docker Compose | Self-contained deployment, matches the deliverable requirement |
| CI/CD | GitHub Actions | Native GitHub integration, selective service builds via path filters |

---

## 10. Money Representation

**Decision:** Use Prisma `Decimal` type (backed by PostgreSQL `NUMERIC`) and string serialization in APIs.

**Rationale:** Floating-point arithmetic is fundamentally unsuitable for financial calculations due to precision errors (e.g., `0.1 + 0.2 ≠ 0.3`). We use:
- `Decimal` in the database for exact precision
- String representation in API payloads to avoid JSON floating-point serialization issues
- Server-side validation that amounts match the format `^\d+(\.\d{1,2})?$`
