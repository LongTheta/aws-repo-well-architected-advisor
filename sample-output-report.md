# Sample Output Report

Example of a full multi-framework AWS Well-Architected review report produced by the skill.

---

# AWS Well-Architected Review — my-aws-app

**Repository**: `my-aws-app`  
**Review Date**: 2025-03-18  
**Reviewer**: AWS Repo Well-Architected Advisor (Multi-Framework)

---

## 1. Executive Summary

The `my-aws-app` repository contains a containerized application deployed to ECS Fargate with Terraform-managed infrastructure. The architecture shows solid foundations in networking (VPC, private subnets) and CI/CD (GitHub Actions with environment-based promotion). Key gaps include: RDS in single AZ, broad IAM policies, missing secrets rotation, no RTO/RPO documentation, and no cost allocation tags. The overall posture is **moderate** — suitable for non-production with targeted improvements before production.

**Top recommendations**: (1) Enable RDS Multi-AZ, (2) tighten IAM to least privilege, (3) migrate secrets to Secrets Manager with rotation, (4) add cost allocation tags, (5) define and document RTO/RPO, (6) implement structured logging and tracing.

**Multi-framework scores**: AWS 5.2 | CompTIA 5 | Security 5 | DevOps 6 | FinOps 5

---

## 2. Inferred Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         AWS Account                              │
│  Region: us-east-1                                               │
├─────────────────────────────────────────────────────────────────┤
│  VPC (10.0.0.0/16)                                              │
│  ├── Public Subnets (10.0.1.0/24, 10.0.2.0/24) — ALB, NAT      │
│  ├── Private Subnets (10.0.11.0/24, 10.0.12.0/24) — ECS Fargate │
│  └── Data Subnets (10.0.21.0/24, 10.0.22.0/24) — RDS           │
│                                                                  │
│  Compute: ECS Fargate (2 tasks, 0.5 vCPU, 1GB)                   │
│  Database: RDS PostgreSQL 14 (db.t3.small, single AZ)           │
│  Storage: S3 bucket (application assets)                         │
│  Load Balancer: ALB (public)                                     │
└─────────────────────────────────────────────────────────────────┘
```

**Assumptions**:
- Single AWS account (Observed)
- Single region us-east-1 (Observed)
- No hybrid connectivity (Inferred — no Direct Connect/VPN in IaC)
- Secrets in Parameter Store (Observed); rotation status (Missing Evidence)

---

## 3. Multi-Framework Scorecard

| Framework | Score (0–10) | Key Gaps |
|-----------|--------------|----------|
| AWS Well-Architected (avg) | 5.2 | RDS single AZ; broad IAM; no DR |
| CompTIA Operational | 5 | RTO/RPO not defined; backups not tested; limited observability |
| Security/Compliance (NIST/CIS) | 5 | Broad IAM; no rotation; partial hardening |
| DevOps Maturity | 6 | CI/CD present; no X-Ray; limited runbooks |
| Cost Optimization (FinOps) | 5 | No tags; on-demand only; NAT cost |

### AWS Pillar Breakdown

| Pillar | Score (0–10) | Key Gaps |
|--------|--------------|----------|
| Operational Excellence | 6 | CI/CD present; limited runbooks; no X-Ray |
| Security | 5 | Broad IAM; secrets in Parameter Store (no rotation); TLS on ALB |
| Reliability | 4 | RDS single AZ; no DR; basic health checks |
| Performance Efficiency | 6 | Reasonable sizing; no caching layer |
| Cost Optimization | 5 | No tags; on-demand only; NAT Gateway cost |
| Sustainability | 5 | us-east-1; x86; no carbon awareness |

### CompTIA Cloud+ Validation

| Check | Status | Evidence Tag | Flag |
|-------|--------|--------------|------|
| IaC automation | ✅ Present | Observed | — |
| CI/CD present and functional | ✅ Present | Observed | — |
| Backups automated | ✅ Automated | Observed | — |
| **Restore testing** | ❌ Not documented | Missing Evidence | **Flag** |
| **RTO/RPO defined** | ❌ Not documented | Missing Evidence | **Flag** |
| Monitoring with actionable alerts | ⚠️ Basic CloudWatch | Observed | — |
| Environments reproducible | ✅ Terraform | Observed | — |
| **Troubleshooting via logs/metrics/traces** | ⚠️ Limited | Inferred | **Flag** |

---

## 4. Top 10 Risks

| Rank | ID | Finding | Pillar | Severity | Confidence | Evidence |
|------|-----|---------|--------|----------|------------|----------|
| 1 | S1 | ECS task role has `s3:*` — least privilege violation | Security | Critical | Confirmed | Observed |
| 2 | A1 | RDS single AZ — no failover | Reliability | High | Confirmed | Observed |
| 3 | S2 | Secrets not rotated | Security | High | Strongly Inferred | Inferred |
| 4 | A2 | No DR/backup strategy | Reliability | High | Confirmed | Missing Evidence |
| 5 | D5 | No ECS resource limits — risk of resource exhaustion | Reliability | High | Confirmed | Observed |
| 6 | S4 | Default RDS encryption only | Security | Medium | Confirmed | Observed |
| 7 | Cost | No cost allocation tags | Cost Optimization | Medium | Confirmed | Observed |
| 8 | D2 | No structured logging | Operational Excellence | Medium | Inferred | Inferred |
| 9 | A5 | NAT Gateway cost (consider VPC endpoints) | Cost Optimization | Medium | Confirmed | Observed |
| 10 | D3 | No distributed tracing | Operational Excellence | Low | Assumed | Missing Evidence |

---

## 5. Role-Based Findings

### Architect

| ID | Finding | Evidence Tag | Severity |
|----|---------|--------------|----------|
| A1 | RDS in single AZ — no failover | Observed | High |
| A2 | No DR or cross-region backup | Missing Evidence | High |
| A3 | VPC has 3-tier design (public/private/data) | Observed | Positive |
| A4 | No Transit Gateway or hybrid connectivity | Inferred | Low |
| A5 | NAT Gateway per AZ — consider cost vs HA | Observed | Medium |

### Developer

| ID | Finding | Evidence Tag | Severity |
|----|---------|--------------|----------|
| D1 | CI/CD has dev/stage/prod with manual gates | Observed | Positive |
| D2 | No structured logging (JSON) or trace IDs | Inferred | Medium |
| D3 | No X-Ray or distributed tracing | Missing Evidence | Medium |
| D4 | Dockerfile uses specific base image tag | Observed | Positive |
| D5 | No resource limits in ECS task def | Observed | Medium |

### Security

| ID | Finding | Evidence Tag | Severity |
|----|---------|--------------|----------|
| S1 | ECS task role has `s3:*` — too broad | Observed | High |
| S2 | Secrets in Parameter Store; no rotation | Inferred | High |
| S3 | ALB has TLS 1.2+ | Observed | Positive |
| S4 | No KMS customer-managed keys for RDS | Observed | Medium |
| S5 | No audit logging for S3 access | Inferred | Medium |

---

## 6. Prioritized Remediation Backlog

| ID | Finding | Owner | Effort | Impact | Priority |
|----|---------|-------|--------|--------|----------|
| S1 | Restrict ECS task role to specific S3 bucket/prefix | Developer | S | High | P1 |
| A1 | Enable RDS Multi-AZ | Architect | S | High | P1 |
| S2 | Migrate secrets to Secrets Manager with rotation | Security | M | High | P1 |
| A2 | Define and implement RDS backup/DR | Architect | M | High | P2 |
| D5 | Add CPU/memory limits to ECS task definition | Developer | S | Medium | P2 |
| Cost | Add cost allocation tags to all resources | Platform | S | Medium | P2 |
| S4 | Enable KMS CMK for RDS | Security | S | Medium | P2 |
| D2 | Implement structured JSON logging with trace IDs | Developer | M | Medium | P3 |
| A5 | Evaluate VPC endpoints for S3/DynamoDB to reduce NAT cost | Architect | M | Medium | P3 |
| D3 | Add X-Ray or OpenTelemetry tracing | Developer | M | Low | P3 |

*Effort: S = Small (1–2 days), M = Medium (3–5 days), L = Large (1+ weeks)*

---

## 7. Cost-Effective Target Architecture

### Quick Wins (1–2 weeks)

- Add cost allocation tags to all Terraform resources
- Restrict ECS IAM to least privilege (specific bucket/prefix)
- Add ECS task CPU/memory limits
- Enable RDS automated backups with 7-day retention

### Medium-Term (1–2 months)

- Enable RDS Multi-AZ
- Migrate secrets to Secrets Manager with rotation
- Add VPC endpoints for S3 (and DynamoDB if used) to reduce NAT data transfer cost
- Implement structured logging and X-Ray tracing

### Strategic Redesign (3+ months)

- Evaluate Graviton-based Fargate for cost/sustainability
- Implement cross-region DR (e.g., RDS read replica in secondary region)
- Add caching layer (ElastiCache) if read-heavy
- Consider Savings Plans or Reserved capacity for steady-state workload

---

## 8. Compliance Gaps (NIST/CIS)

| Control / Category | Status | Evidence | Remediation |
|--------------------|--------|----------|-------------|
| NIST AC-3 (Access Enforcement) | Gap | ECS role has `s3:*` | Restrict to least privilege |
| NIST AC-6 (Least Privilege) | Gap | Broad IAM policies | Scope policies to specific resources |
| NIST SC-8 (Transmission Confidentiality) | Met | TLS on ALB | — |
| NIST SC-13 (Cryptographic Protection) | Partial | Default RDS encryption | Enable KMS CMK |
| NIST SC-28 (Protection at Rest) | Partial | S3 default encryption | Consider KMS CMK for sensitive buckets |
| CIS 2.1.x (IAM) | Gap | No MFA, broad policies | Implement least privilege |
| CIS 3.x (Logging) | Partial | CloudTrail inferred | Verify CloudTrail enabled; add S3 access logs |
| OWASP A02 (Cryptographic Failures) | Partial | TLS present; rotation missing | Enable secrets rotation |

---

## 9. Suggested Next Implementation Steps by Repo

### infrastructure/terraform/

1. In `iam.tf`: Replace `s3:*` with `s3:GetObject`, `s3:PutObject` scoped to bucket/prefix
2. In `rds.tf`: Set `multi_az = true`; add `backup_retention_period = 7`
3. In `*.tf`: Add `tags = { Environment = var.environment, Project = "my-aws-app" }` to all resources
4. In `ecs.tf`: Add `cpu` and `memory` limits to task definition

### .github/workflows/

1. Add secret scanning step (e.g., `trufflehog` or GitHub secret scanning)
2. Add SBOM generation (e.g., `syft`) to deploy workflows

### Application (src/)

1. Add structured JSON logging with `trace_id` / `request_id`
2. Integrate AWS X-Ray SDK for distributed tracing

---

*End of sample report*
