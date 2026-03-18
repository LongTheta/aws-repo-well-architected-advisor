# AWS Federal-Grade Checklist

Evaluate an AWS architecture, repository, or platform design against federal-grade security, compliance, and operational standards. **HIGH-STRICTNESS** evaluation.

**Frameworks:** NIST 800-53, FedRAMP, DoD DevSecOps / Zero Trust, AWS Well-Architected Framework.

---

## Input

Accept any of:

- **Repository** — Terraform, CDK, CloudFormation, app code
- **Architecture description** — Written design or diagram
- **Inferred system design** — From repo discovery + architecture inference

---

## Evaluation Categories

### 1. Identity & Access Management (NIST AC, IA)

| Check | Pass Criteria |
|-------|---------------|
| No long-lived IAM user credentials | Use roles; temporary credentials |
| IAM roles used for workloads | Task roles; instance profiles |
| Least privilege policies enforced | No excessive permissions |
| No wildcard permissions ("*") | Resource-level where possible |
| MFA required for privileged users | Root + admin users |
| AWS SSO / Identity Center | For human access |

**FAIL if:**
- Wildcard admin access exists
- Hardcoded credentials detected

---

### 2. Secrets Management (NIST IA, SC)

| Check | Pass Criteria |
|-------|---------------|
| Secrets stored in Secrets Manager OR SSM Parameter Store (secure string) | No .env, variables.tf with secrets |
| No secrets in code or environment files | No API keys, passwords in repo |
| KMS encryption used | Customer-managed keys where appropriate |

**FAIL if:**
- Secrets found in repo
- Plaintext credentials used

---

### 3. Logging & Auditing (NIST AU)

| Check | Pass Criteria |
|-------|---------------|
| CloudTrail enabled (all regions) | Organization trail or per-account |
| Logs retained appropriately | Per retention policy |
| Centralized logging (S3 / logging account) | No local-only logs |
| Monitoring for auth failures, privilege escalation, unusual activity | Alarms; GuardDuty |

**HIGH RISK if:**
- CloudTrail not enabled
- No audit logging

---

### 4. Network Security (NIST SC)

| Check | Pass Criteria |
|-------|---------------|
| Public exposure minimized | Backend in private subnets |
| Security groups restrict access | No 0.0.0.0/0 without justification |
| No open ports (0.0.0.0/0) without justification | Documented exception only |
| Private subnets for sensitive services | DB, app servers private |
| ALB for public-facing | L7; health checks |
| WAF if public-facing | Web Application Firewall |
| VPC endpoints where appropriate | S3, ECR, SSM; minimize NAT |

**FAIL if:**
- Unrestricted SSH/RDP open (22, 3389 to 0.0.0.0/0)
- Database publicly exposed

---

### 5. Data Protection (NIST SC, CP)

| Check | Pass Criteria |
|-------|---------------|
| Encryption at rest (KMS) | RDS, S3, EBS |
| Encryption in transit (HTTPS/TLS) | No plain HTTP |
| Backup strategy | RDS snapshots; S3 versioning |
| Data classification awareness | Tagged; handling defined |

**FAIL if:**
- Sensitive data unencrypted
- No backup strategy

---

### 6. Vulnerability Management (NIST SI)

| Check | Pass Criteria |
|-------|---------------|
| Dependency scanning in CI/CD | pip audit, npm audit, Snyk, Dependabot |
| Container scanning (if containers) | ECR scan; Trivy |
| Patch/update process exists | Documented; automated where possible |
| Amazon Inspector (if EC2) | Vulnerability assessment |
| ECR scanning (if containers) | Image scan on push |

**MEDIUM/HIGH if missing**

---

### 7. DevSecOps Pipeline (DoD DevSecOps)

| Check | Pass Criteria |
|-------|---------------|
| CI/CD pipeline exists | GitHub Actions, GitLab CI, CodePipeline |
| Security scans integrated | SAST, dependency, container |
| Infrastructure as Code used | Terraform, CDK, CloudFormation |
| Artifact versioning | Immutable; traceable |
| No manual production deployments | Automated; approval gates |

**FAIL if:**
- Manual deployments required
- No scanning in pipeline

---

### 8. Zero Trust Alignment (DoD / NIST 800-207)

| Check | Pass Criteria |
|-------|---------------|
| Identity-based access (not network-based trust) | Verify identity; not "inside network = trusted" |
| Least privilege enforced | Minimal permissions |
| Segmentation between services | Security groups; no flat network |
| No implicit trust zones | Explicit allow; deny by default |

---

### 9. Tagging & Governance (FinOps + Compliance)

**REQUIRED TAGS:**

| Tag | Purpose |
|-----|---------|
| Project | Cost allocation |
| Environment | dev, test, prod |
| Owner | Responsible team |
| CostCenter | Chargeback |
| ManagedBy | terraform, cloudformation, manual |
| DataClassification | public, internal, confidential, restricted |
| Lifecycle | active, deprecated, experimental |

**FAIL if:**
- Missing cost or ownership tags
- Production resources untagged

---

### 10. Resilience & Recovery (NIST CP)

| Check | Pass Criteria |
|-------|---------------|
| Multi-AZ deployment (if production) | No single point of failure |
| Backup + restore tested or defined | RTO/RPO documented |
| Health checks + failover | ALB; auto-recovery |
| DR strategy defined | Documented; tested |

---

## Scoring

Score each category 0–10:

| Score | Meaning |
|-------|---------|
| 9–10 | Compliant |
| 7–8 | Minor gaps |
| 5–6 | Moderate risk |
| 3–4 | High risk |
| 0–2 | Critical failure |

**Overall risk level:** Low / Moderate / High / Critical (derived from category scores and failures).

---

## Output Format

Produce the following sections in order:

### 1. Executive Summary

- Overall compliance score (0–100)
- Risk level (Low / Moderate / High / Critical)
- One-paragraph summary

### 2. Category Scores

| Category | Score | Status |
|----------|-------|--------|
| Identity & Access Management | 0–10 | Compliant / Minor gaps / Moderate / High / Critical |
| Secrets Management | 0–10 | … |
| Logging & Auditing | 0–10 | … |
| Network Security | 0–10 | … |
| Data Protection | 0–10 | … |
| Vulnerability Management | 0–10 | … |
| DevSecOps Pipeline | 0–10 | … |
| Zero Trust Alignment | 0–10 | … |
| Tagging & Governance | 0–10 | … |
| Resilience & Recovery | 0–10 | … |

### 3. Critical Failures

- Must fix before production
- List each with evidence and NIST mapping

### 4. High-Risk Findings

- Significant gaps; prioritize remediation

### 5. Compliance Gaps (NIST Mapping)

- Map findings to NIST 800-53 control families (AC, IA, AU, SC, CP, SI)
- Include FedRAMP relevance where applicable

### 6. Remediation Actions

- Prioritized (Critical → High → Medium → Low)
- Actionable; specific fixes
- Per finding: issue, recommendation, effort, NIST control

### 7. Production Readiness Verdict

| Verdict | Meaning |
|---------|---------|
| **NOT READY** | Critical failures; do not deploy |
| **CONDITIONAL** | High-risk findings; fix before prod or accept documented risk |
| **READY** | No critical failures; minor gaps acceptable with plan |

---

## Rules

- **Be strict** — Federal-grade expectations; no leniency
- **Do NOT assume best-case** — Missing evidence = risk
- **Flag missing evidence as risk** — Cannot confirm = treat as gap
- **Prioritize security over cost** — Compliance first
- **Provide actionable fixes** — Specific recommendations, not generic advice
- **Map to NIST** — Every finding tied to control family

---

## Invocation

```
Evaluate this [repository / architecture description] against federal-grade standards.

Use aws-federal-grade-checklist:
- NIST 800-53, FedRAMP, DoD DevSecOps, Zero Trust
- Score all 10 categories
- Output: Executive Summary, Category Scores, Critical Failures, High-Risk Findings, Compliance Gaps, Remediation Actions, Production Readiness Verdict
- Be strict; flag missing evidence as risk.
```

---

## Integration

- **Regulated workload mode** — Invoked when `workload-sizing-rules.yaml` detects regulated signals
- **skill-trigger-matrix.yaml** — Federal, FedRAMP, HIPAA, PCI, Zero Trust, audit → full compliance stack
- **nist-compliance-evaluator** — Complements with detailed NIST control mapping

---

## End Goal

Ensure the AWS platform meets **federal-grade security, compliance, and operational readiness** standards before production deployment. No shortcuts; no assumptions.
