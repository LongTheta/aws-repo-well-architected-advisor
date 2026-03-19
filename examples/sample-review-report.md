# Sample Review Report

Example output for /repo-assess or /quality-gate. Conforms to schemas/review-score.schema.json.

---

## 1. Executive Summary

**Health**: Good — Moderate Risk

**Strengths**: VPC present, CI/CD in place, IAM roles defined.

**Risks**: No cost tags, RDS single-AZ, IAM wildcard in one policy.

**Suitability**: Best for dev/stage; address P1 before production.

---

## 2. Scope Reviewed

| Scope | Included |
|-------|----------|
| Artifacts | Terraform (vpc.tf, ecs.tf, rds.tf, iam.tf), GitHub Actions |
| Modules | repo-discovery, architecture-inference, security-review, networking-review, observability-review |
| Evidence | terraform/*.tf, .github/workflows/ |

---

## 3. Inferred AWS Architecture

| Component | Description | Evidence Type |
|-----------|-------------|---------------|
| Compute | ECS Fargate | Observed |
| Networking | VPC, public/private subnets | Observed |
| Data | RDS PostgreSQL, S3 | Observed |
| CI/CD | GitHub Actions | Observed |
| IAM | Roles, policies | Observed |

---

## 4. Weighted Scorecard

| Category | Score | Weight | Key Gaps |
|----------|-------|--------|----------|
| Security | 6 | 20% | IAM wildcard |
| Reliability | 5 | 15% | RDS single-AZ |
| Performance | 7 | 10% | Adequate |
| Cost Awareness | 4 | 15% | No tags |
| Operational Excellence | 7 | 15% | CI present |
| Observability | 5 | 15% | Limited |
| Compliance Evidence | 5 | 10% | Partial |

**Weighted score**: 5.6 | **Letter grade**: C | **Production readiness**: CONDITIONAL | **Confidence**: Strongly Inferred

---

## 5. Top Risks

| # | Title | Severity | Area |
|---|-------|----------|------|
| 1 | No cost allocation tags | HIGH | governance |
| 2 | RDS single-AZ for prod | HIGH | reliability |
| 3 | IAM Resource: "*" | MEDIUM | security |

---

## 6–7. Evidence Found / Missing Evidence

**Found**: VPC config, ECS task def, RDS config, IAM roles, GitHub workflow.

**Missing**: Backup config, RTO/RPO, observability dashboards.

---

## 8. Role-Based Findings

**Architect**: Add VPC endpoints for S3; confirm RDS Multi-AZ for prod.

**Developer**: Add default_tags to Terraform; fix IAM wildcard.

**Security**: Apply least privilege to IAM policy.

**Operations**: Add CloudWatch alarms; approval gates for prod.

---

## 9. Remediation Backlog

**P1**: Add cost tags; RDS Multi-AZ for prod.

**P2**: Fix IAM wildcard; VPC endpoints.

**P3**: Observability; approval gates.

---

## 10. Production Readiness Decision

**Verdict**: CONDITIONAL

**Rationale**: Address P1 before production. No CRITICAL findings.

---

## 11–12. Target Architecture / Next Review

**Target**: Add tags, Multi-AZ RDS, VPC endpoints, observability.

**Next review**: After P1 remediation.
