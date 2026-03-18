# AWS Federal-Grade Checklist — Scoring Rubric

Scores are 0–10 per category. Higher = better alignment. **Never assume compliance without evidence.**

---

## 1. Identity and Access Management (AC, IA)

| Score | Criteria |
|-------|----------|
| 9–10 | No long-lived creds; roles for workloads; least privilege; no wildcards; MFA; SSO |
| 7–8 | Good IAM; minor wildcards; MFA present |
| 5–6 | Basic IAM; some broad policies |
| 3–4 | Broad IAM; wildcards; no MFA |
| 0–2 | Wildcard admin; hardcoded credentials |

**Critical if:** Wildcard admin access; hardcoded AWS credentials

---

## 2. Secrets Management (IA, SC)

| Score | Criteria |
|-------|----------|
| 9–10 | Secrets Manager or SSM SecureString; KMS; no secrets in repo |
| 7–8 | Secrets managed; minor gaps |
| 5–6 | Partial; some secrets in Parameter Store |
| 3–4 | Secrets in env; possible hardcoded |
| 0–2 | Plaintext secrets in code |

**Critical if:** Secrets in code or plaintext config

---

## 3. Logging and Audit (AU)

| Score | Criteria |
|-------|----------|
| 9–10 | CloudTrail; centralized logs; retention; monitoring for auth/privilege |
| 7–8 | Audit trail present; alerts configured |
| 5–6 | Basic logging; partial audit |
| 3–4 | Minimal logging; no audit |
| 0–2 | No audit trail |

**High risk if:** No audit trail evidence

---

## 4. Network Security (SC)

| Score | Criteria |
|-------|----------|
| 9–10 | Minimal public exposure; narrow SGs; private subnets; no 0.0.0.0/0; WAF; VPC endpoints |
| 7–8 | Good segmentation; SG scoped |
| 5–6 | Basic segmentation; some 0.0.0.0/0 |
| 3–4 | Broad ingress; public exposure |
| 0–2 | Unrestricted SSH/RDP; public DB |

**Critical if:** Unrestricted SSH/RDP; public database exposure

---

## 5. Data Protection (SC, CP)

| Score | Criteria |
|-------|----------|
| 9–10 | Encryption at rest and in transit; backup strategy; data classification; restore defined |
| 7–8 | Encryption in place; backups; minor gaps |
| 5–6 | Partial encryption; some backups |
| 3–4 | Default encryption only; weak backups |
| 0–2 | Sensitive data unencrypted; no backup |

**Critical if:** Sensitive data unencrypted; no backup strategy

---

## 6. Vulnerability Management (SI)

| Score | Criteria |
|-------|----------|
| 9–10 | Dependency + container scanning in CI; patch process; Inspector/ECR |
| 7–8 | Scanning present; patch process |
| 5–6 | Partial scanning |
| 3–4 | Minimal scanning |
| 0–2 | No scanning |

---

## 7. DevSecOps Pipeline (DoD)

| Score | Criteria |
|-------|----------|
| 9–10 | CI/CD; IaC; security scans; artifact versioning; automated prod deploy |
| 7–8 | Pipeline present; scanning integrated |
| 5–6 | Pipeline present; limited scanning |
| 3–4 | Partial pipeline; no scanning |
| 0–2 | Manual deploy; no scanning |

**High risk if:** Manual production deploy; no pipeline scanning

---

## 8. Zero Trust Alignment (DoD / NIST 800-207)

| Score | Criteria |
|-------|----------|
| 9–10 | Identity-based access; least privilege; segmentation; no implicit trust |
| 7–8 | Good alignment |
| 5–6 | Partial alignment |
| 3–4 | Network-based trust assumptions |
| 0–2 | No Zero Trust alignment |

---

## 9. Tagging and Governance (FinOps)

| Score | Criteria |
|-------|----------|
| 9–10 | All required tags: Project, Environment, Owner, CostCenter, ManagedBy, Purpose, DataClassification, Lifecycle |
| 7–8 | Most tags present |
| 5–6 | Partial tagging |
| 3–4 | Missing cost/ownership tags |
| 0–2 | No tagging |

**High risk if:** Ownership or cost attribution tags missing

---

## 10. Resilience and Recovery (CP)

| Score | Criteria |
|-------|----------|
| 9–10 | Multi-AZ; backups; restore defined; failover; DR documented |
| 7–8 | Backups; failover; DR inferable |
| 5–6 | Basic backups |
| 3–4 | Minimal resilience |
| 0–2 | No backup; no DR |

---

## Severity Classification

| Severity | Definition | Example |
|----------|------------|---------|
| **critical** | Must fix before production | Hardcoded secrets, public DB, wildcard admin |
| **high** | Significant gap; prioritize | No audit trail, missing tags, no scanning |
| **medium** | Important improvement | Suboptimal retention, minor wildcards |
| **low** | Nice to have | Formatting, hygiene |

---

## Confidence Classification

| Confidence | Definition |
|------------|------------|
| **high** | Direct evidence in repo |
| **medium** | Clear pattern from artifacts |
| **low** | Inferred; limited evidence |

---

## Evidence Type

| evidence_type | Meaning |
|---------------|---------|
| **observed** | Direct evidence in repo |
| **inferred** | Derived from patterns |
| **missing** | No evidence; cannot assume compliance |
| **contradictory** | Conflicting signals |

---

## Production Readiness Verdict

| Verdict | Criteria |
|---------|----------|
| **NOT READY** | Any critical failure; do not deploy |
| **CONDITIONAL** | High-risk findings; fix before prod or accept documented risk |
| **READY** | No critical failures; minor gaps acceptable with remediation plan |
