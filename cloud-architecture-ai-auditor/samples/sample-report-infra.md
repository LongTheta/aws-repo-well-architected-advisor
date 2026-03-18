# Cloud Architecture Review — platform-infrastructure (Infrastructure Repo)

**Review Date:** 2025-03-18

---

## 1. Executive Summary

The `platform-infrastructure` repository contains Terraform-managed AWS infrastructure: VPC, with GitHub Actions for plan. **Key gaps**: VPC has no subnets defined in sample; no IAM, RDS, or ECS; minimal structure. **Overall posture**: Early-stage — expand with subnets, IAM, compute before production.

**Top recommendations**: (1) Add subnet configuration, (2) add IAM roles, (3) add cost allocation tags.

---

## 2. Repo Classification

| Field | Value |
|-------|-------|
| **repo_type** | infrastructure |
| **confidence** | high |
| **reasoning** | Terraform present; no app runtime logic; infrastructure/ as primary |

---

## 3. Review Mode

| Field | Value |
|-------|-------|
| **review_mode** | standard |
| **reason_for_selection** | IaC + CI/CD present; escalation to deep not triggered (networking partial) |

---

## 4. Inferred Architecture

```
AWS Account | Region: us-east-1
├── VPC (10.0.0.0/16)
├── CI/CD: GitHub Actions (plan.yml)
└── No subnets, IAM, compute in sample
```

**Assumptions**: Single region (Observed). No subnets (Missing). No compute (Missing).

---

## 5. Scorecard

| Framework | Score | Key Gaps |
|-----------|-------|----------|
| AWS Well-Architected | 4 | Minimal VPC; no subnets, IAM, compute |
| Security | 4 | No IAM; no encryption config |
| Reliability | N/A | Cannot determine |
| Cost | 5 | No tags |
| Operations | 6 | CI present |

---

## 6. Top Risks

| id | title | severity | confidence | evidence_type | affected_area |
|----|-------|----------|------------|---------------|---------------|
| I1 | VPC has no subnet configuration | high | high | missing | reliability |
| I2 | No IAM roles or policies defined | high | high | missing | security |
| I3 | No cost allocation tags | medium | high | observed | cost |
| I4 | Terraform plan only; no apply workflow | low | high | observed | operations |

---

## 7. Findings (Deduplicated)

### I1 — No subnet configuration
- **summary**: VPC exists but no subnets; deployment will fail.
- **evidence**: terraform/vpc.tf
- **evidence_type**: missing
- **severity**: high
- **confidence**: high
- **affected_area**: reliability
- **recommendation**: Add aws_subnet resources for public/private
- **effort**: medium
- **impact**: reliability
- **framework_mapping**: { aws_pillar: "reliability", nist_control: "SC-7" }

### I2 — No IAM defined
- **summary**: No IAM roles or policies; least privilege cannot be assessed.
- **evidence**: N/A
- **evidence_type**: missing
- **severity**: high
- **confidence**: high
- **affected_area**: security
- **recommendation**: Add iam.tf with roles and least-privilege policies
- **effort**: medium
- **impact**: security
- **framework_mapping**: { aws_pillar: "security", nist_control: "AC-3" }

### I3 — No cost allocation tags
- **summary**: VPC has minimal tags; no cost allocation.
- **evidence**: terraform/vpc.tf
- **evidence_type**: observed
- **severity**: medium
- **confidence**: high
- **affected_area**: cost
- **recommendation**: Add tags: Environment, Project, CostCenter
- **effort**: low
- **impact**: cost
- **framework_mapping**: { aws_pillar: "cost_optimization", devops_dora_finops: "finops" }

---

## 8. Cost Snapshot

**Estimated monthly**: Low (<$50) — VPC only; no NAT, compute, or RDS.  
**Confidence**: medium  
**Top drivers**: VPC (minimal cost).

---

## 9. Over-Engineering Check

No over-engineering. Sample is minimal. Guardrails: Do not add EKS, multi-region, or complex observability without justification.

---

## 10. Remediation Backlog

| Issue | Evidence | Fix | Effort | Impact |
|-------|----------|-----|--------|--------|
| No subnets | vpc.tf | Add subnet resources | medium | reliability |
| No IAM | N/A | Add iam.tf | medium | security |
| No tags | vpc.tf | Add tags block | low | cost |
| Plan only | plan.yml | Add apply workflow (with approval) | low | operations |

---

## 11. Target-State Recommendation

- Add public/private subnets
- Add IAM roles with least privilege
- Add cost allocation tags
- Add Terraform apply workflow with manual approval for prod
- Prefer managed services (RDS, ECS) over self-managed when adding compute
