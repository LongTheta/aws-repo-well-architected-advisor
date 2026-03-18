# Cloud Architecture Review — [Project: order-platform] (Spec-Driven)

**Operating Mode:** Spec-Driven  
**Review Date:** 2025-03-18  
**Reviewer:** Automated Architecture Review System

---

## 1. Executive Summary

Platform design for a **small SaaS web app** (order management). Questionnaire answers indicate: low traffic, cost-sensitive, small team, relational data, light async. **Recommended baseline:** Lambda + API Gateway + RDS Postgres + Cognito + SQS. **Cost band:** Low ($50–$250/mo). Suitable for MVP; growth path defined for moderate and high scale.

---

## 2. Interpreted Requirements

| Core Area | Constraints |
|-----------|-------------|
| **Business** | Cost-sensitive; avoid overbuild; moderate growth expected |
| **Users** | Authenticated customers; low traffic → serverless viable |
| **Data** | Relational; important (not mission-critical); backups required |
| **Workload** | Web app; light async (emails) → SQS + Lambda |
| **Security** | Simple login → Cognito; basic compliance |
| **Team** | Small team → no EKS; prefer managed services |

---

## 3. Architecture Decisions (with Reasoning)

| Decision | Choice | Why (tied to input) |
|----------|--------|---------------------|
| Compute | Lambda + API Gateway | Low traffic + cost-sensitive + small team → serverless first |
| Database | RDS Postgres (single-AZ dev; Multi-AZ prod) | Relational + important → managed; cost-aware for dev |
| Auth | Cognito | Simple login |
| Async | SQS + Lambda | Light async (emails) |
| Networking | Single VPC; public + private subnets; VPC endpoints | Cost-sensitive → minimize NAT |
| Observability | CloudWatch Logs, Metrics, Alarms | Always include; basic dashboards |

---

## 4. Recommended AWS Services

| Category | Service | Justification |
|----------|---------|---------------|
| Compute | Lambda, API Gateway | Serverless; scale to zero; pay per request |
| Data | RDS Postgres | Relational; ACID; managed |
| Storage | S3 | Static assets; backups |
| Auth | Cognito | User pools; MFA |
| Async | SQS, Lambda | Light async; event-driven |
| Networking | VPC, ALB, Route 53 | Standard pattern |
| Observability | CloudWatch | Logs, metrics, alarms |
| Secrets | Secrets Manager | DB credentials; rotation |

---

## 5. Architecture Flow (Text)

```
User → Route 53 → CloudFront (optional) → ALB/API Gateway
  → Lambda (API) → RDS Postgres
  → SQS (async) → Lambda (worker) → Email/SNS
  → S3 (static, backups)
  → Cognito (auth)
```

---

## 6. Cost Snapshot

| Field | Value |
|-------|-------|
| **Estimated monthly range** | $50–$250 |
| **Top drivers** | RDS, Lambda invocations, S3 |
| **Confidence** | Medium (no usage data) |

---

## 7. Security Baseline

- IAM roles for Lambda, ECS; no hardcoded creds
- Secrets Manager for DB credentials
- Encryption at rest (RDS, S3)
- HTTPS everywhere
- Cognito for auth

---

## 8. Observability Plan

- CloudWatch Logs for Lambda, API
- CloudWatch Metrics + Alarms for errors, latency
- Basic dashboard: requests, errors, DB connections

---

## 9. Tagging Compliance

All resources must include: Project, Environment, Owner, CostCenter, ManagedBy, Purpose, DataClassification, Lifecycle. See `tagging-compliance.yaml`.

---

## 10. Risks & Tradeoffs

| Tradeoff | Resolution |
|----------|------------|
| Cost vs Reliability | Single-AZ for dev; Multi-AZ for prod |
| Simplicity vs Flexibility | Lambda first; ECS if outgrow |
| Speed vs Security | Basic compliance; add audit if regulated |

---

## 11. Growth Path

| Stage | Triggers | Changes |
|-------|----------|---------|
| **Initial** | Day one | Lambda, RDS single-AZ, SQS |
| **Moderate** | Traffic growth; team growth | RDS Multi-AZ; add ElastiCache; autoscaling |
| **High** | High traffic; compliance | ECS if Lambda limits; read replica; stricter IAM |
