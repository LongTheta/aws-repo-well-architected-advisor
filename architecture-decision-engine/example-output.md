# Architecture Decision Engine — Example Output

Full output for **Example 1: Small Startup** (task management app) from `example-input.md`.

---

# AWS Architecture Decision — Task Management App

**Mode:** Spec-Driven  
**Date:** 2025-03-18  
**Input:** Small team, MVP, $100–$300/mo budget, low ops preference

---

## 1. Architecture Summary

| Aspect | Decision |
|--------|----------|
| **Compute** | Lambda (API) + Lambda (background jobs) |
| **API** | API Gateway HTTP API |
| **Data** | RDS Postgres (db.t3.micro) or Aurora Serverless v2 (if variable load) |
| **Auth** | Cognito User Pools |
| **Storage** | S3 for file attachments |
| **Networking** | Default VPC acceptable for MVP; move to custom VPC at scale |
| **CI/CD** | GitHub Actions → CodePipeline or direct deploy |

**Rationale:** Serverless-first minimizes ops burden. Lambda + API Gateway + Cognito = zero servers to manage. RDS micro fits budget; Aurora Serverless v2 if load is spiky. S3 for blobs. Custom VPC can wait until compliance or multi-env needs arise.

---

## 2. Recommended AWS Services

| Category | Service | Why |
|----------|---------|-----|
| Compute | Lambda | Pay-per-use; no servers; fits bursty MVP traffic |
| API | API Gateway HTTP API | Cheaper than REST API; sufficient for CRUD |
| Database | RDS Postgres (db.t3.micro) | Relational; ACID; $15–25/mo; familiar |
| Auth | Cognito User Pools | Managed auth; MFA optional; no custom auth code |
| Storage | S3 | Blob storage; cheap; versioning for attachments |
| Queue | SQS | Async jobs; decouple Lambda from DB |
| Secrets | Secrets Manager | DB credentials; rotate automatically |
| Logs | CloudWatch Logs | Lambda logs; retention 7 days for MVP |

---

## 3. Decision Justifications

### Lambda vs ECS vs EKS vs EC2

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Lambda** | No servers; pay-per-use; auto-scale; low ops | Cold starts; 15 min timeout; vendor lock-in | **Chosen** — MVP, low traffic, cost-sensitive |
| ECS Fargate | More control; no cold starts | Always-on cost; more ops | Revisit at 10K+ req/day |
| EKS | Full Kubernetes | Overkill; high ops; expensive | Not for MVP |
| EC2 | Cheapest at high steady load | Manual scaling; patching; ops | Not for small team |

**Decision:** Lambda. Team size (3), budget ($100–300), and "serverless simplicity" preference all point to Lambda. Cold starts acceptable for task management UX.

### RDS vs DynamoDB vs Aurora

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **RDS Postgres** | Relational; ACID; familiar; $15–25/mo | Single-AZ at micro; manual scaling | **Chosen** — relational data, small size |
| DynamoDB | Serverless; scales; pay-per-use | No joins; different model | Consider if schema becomes document-heavy |
| Aurora Serverless v2 | Auto-scale; Postgres-compatible | Higher min cost | Consider if load is spiky |

**Decision:** RDS Postgres db.t3.micro. Relational model fits tasks/projects/users. Data size < 10 GB. Aurora Serverless v2 if traffic is unpredictable.

### VPC

**Decision:** Default VPC for MVP. Custom VPC when: multi-env, compliance, or stricter network segmentation needed.

---

## 4. Tradeoff Analysis

### Lambda vs ECS: When to Choose Each

| Factor | Lambda | ECS |
|--------|--------|-----|
| **Ops burden** | Very low | Medium–high |
| **Cost at low traffic** | Lower | Higher (always-on) |
| **Cost at high steady traffic** | Higher | Lower |
| **Cold starts** | Yes (1–3s) | No |
| **Timeout** | 15 min max | No practical limit |
| **When to choose** | MVP, bursty, small team | Steady load, long-running, need control |

### RDS vs DynamoDB: When to Choose Each

| Factor | RDS | DynamoDB |
|--------|-----|----------|
| **Data model** | Relational | Key-value / document |
| **Consistency** | Strong (ACID) | Eventually consistent (or strong with extra cost) |
| **Joins** | Yes | No |
| **Scaling** | Vertical then read replicas | Horizontal; automatic |
| **Cost at small scale** | Predictable; ~$25/mo | Pay-per-request; can be cheaper |
| **When to choose** | Relational; complex queries | Simple access patterns; high scale |

---

## 5. Cost Strategy

**Target:** Low ($100–$300/mo)

| Component | Est. Monthly Cost |
|-----------|-------------------|
| Lambda | $5–20 (depends on invocations) |
| API Gateway | $5–15 |
| RDS db.t3.micro | $15–25 |
| Cognito | $0 (free tier) |
| S3 | $2–10 |
| SQS | $0–5 |
| CloudWatch | $5–15 |
| **Total** | **$32–90** (within target) |

**Cost risks:**
- Lambda: Cost grows with invocations; set budget alerts
- RDS: Moving to larger instance or Aurora increases cost
- S3: Egress costs if serving large files publicly

**Scaling path:** At 5K+ DAU, consider Aurora Serverless v2 or RDS read replica. At 20K+ DAU, evaluate ECS Fargate for API tier.

---

## 6. Risks and Constraints

| Risk | Mitigation |
|------|------------|
| Lambda cold starts | Use provisioned concurrency for critical paths if needed; or accept 1–3s for MVP |
| RDS single point of failure | Single-AZ acceptable for MVP; add Multi-AZ at production |
| No custom VPC | Default VPC OK for MVP; add VPC when compliance or isolation required |
| Budget overrun | Set AWS Budget alerts at $200 and $300 |

---

## 7. Suggested Next Steps

1. **Create IaC** — Terraform or CDK for Lambda, API Gateway, RDS, Cognito, S3
2. **Set up CI/CD** — GitHub Actions → deploy Lambda; RDS migrations via pipeline
3. **Add observability** — CloudWatch dashboards for Lambda errors, RDS connections, API latency
4. **Budget alerts** — AWS Budgets at $200 and $300
5. **Re-evaluate at 5K DAU** — Consider Aurora, provisioned concurrency, or ECS if Lambda cost grows
