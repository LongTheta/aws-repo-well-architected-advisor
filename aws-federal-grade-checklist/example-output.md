# AWS Federal-Grade Checklist — Example Output

Full report for the **weak repo** from `example-input.md`. Demonstrates critical findings, category scores, remediation plan, and verdict.

---

# Federal-Grade Evaluation — weak-aws-app

**Evaluation Date:** 2025-03-18  
**Evaluator:** aws-federal-grade-checklist  
**Input:** Repository (Terraform, Dockerfile, CI/CD)

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Overall Score** | 28/100 |
| **Risk Level** | Critical |
| **Critical Failures** | 4 |
| **High-Risk Findings** | 5 |
| **Verdict** | **NOT READY** |

This AWS platform has **multiple critical security failures** and must not be deployed to production. Hardcoded credentials, public database exposure, unrestricted SSH/RDP and PostgreSQL ports, and secrets in user_data represent immediate compliance failures. Remediation is required before any production deployment.

---

## 2. Category Score Table

| Category | Score | Status | NIST |
|----------|-------|--------|------|
| Identity and Access Management | 2 | Critical failure | AC, IA |
| Secrets Management | 1 | Critical failure | IA, SC |
| Logging and Audit | 3 | High risk | AU |
| Network Security | 1 | Critical failure | SC |
| Data Protection | 2 | Critical failure | SC, CP |
| Vulnerability Management | 4 | High risk | SI |
| DevSecOps Pipeline | 4 | High risk | DoD |
| Zero Trust Alignment | 3 | High risk | AC, SC |
| Tagging and Governance | 2 | Critical failure | FinOps |
| Resilience and Recovery | 6 | Moderate risk | CP |

---

## 3. Critical Failures

| ID | Issue | Evidence | NIST |
|----|-------|----------|------|
| CF-1 | Hardcoded credentials in variables.tf | `variable "db_password" { default = "admin123" }` | IA-5, SC-28 |
| CF-2 | Secrets in user_data (passed to instance) | `user_data` contains `DB_PASSWORD` | IA-5, SC-28 |
| CF-3 | Unrestricted SSH (port 22) to 0.0.0.0/0 | `aws_security_group.app` ingress | SC-7 |
| CF-4 | Public database exposure | `publicly_accessible = true`; port 5432 to 0.0.0.0/0 | SC-7, SC-28 |

**Must fix before production.** No exceptions.

---

## 4. High-Risk Findings

| ID | Issue | Evidence | Severity | Confidence |
|----|-------|----------|----------|------------|
| HR-1 | No CloudTrail or audit logging evidence | No CloudTrail resources in repo | high | missing |
| HR-2 | No resource tagging | No `tags` or `default_tags` in provider | high | observed |
| HR-3 | No container image scanning in CI | `.github/workflows/deploy.yml` has no scan step | high | observed |
| HR-4 | No dependency scanning in CI | No pip audit, npm audit, or equivalent | high | observed |
| HR-5 | Manual production deployment | `terraform apply -auto-approve` without approval gate | high | observed |

---

## 5. Compliance Gaps (NIST Mapping)

| NIST Family | Gap | Finding |
|-------------|-----|---------|
| **AC** | Access control | Wildcard-like exposure; no least privilege |
| **IA** | Identification & Auth | Hardcoded creds; no MFA/SSO evidence |
| **AU** | Audit | No CloudTrail; no audit trail |
| **SC** | System & Comm Protection | Public DB; unrestricted ports; no encryption evidence |
| **SI** | System Integrity | No vulnerability scanning |
| **CP** | Contingency Planning | No backup/restore evidence for DB |
| **CM** | Config Management | Partial IaC; no drift detection |
| **IR** | Incident Response | No runbook or alert linkage |

---

## 6. Remediation Plan

| ID | Issue | Why It Matters | Recommended Fix | Effort | Impact |
|----|-------|----------------|-----------------|--------|--------|
| CF-1 | Hardcoded credentials | Credential theft; compliance failure | Use AWS Secrets Manager; reference by ARN in Terraform | medium | security |
| CF-2 | Secrets in user_data | Credential exposure in instance metadata | Use Secrets Manager; fetch at runtime via IAM role | medium | security |
| CF-3 | Unrestricted SSH | Unauthorized access; brute force | Restrict to bastion/VPN CIDR; use SSM Session Manager | low | security |
| CF-4 | Public DB | Data breach; compliance failure | Set `publicly_accessible = false`; use private subnet | low | security |
| HR-1 | No audit logging | No accountability; compliance failure | Enable CloudTrail; centralize to S3 | medium | security |
| HR-2 | No tagging | Cost attribution; governance | Add `default_tags` to provider; all 8 required tags | low | ops |
| HR-3 | No container scanning | Vulnerable images in production | Add Trivy or ECR scan step to CI | low | security |
| HR-4 | No dependency scanning | Vulnerable dependencies | Add `pip audit` or Snyk/Dependabot to CI | low | security |
| HR-5 | Manual deploy | Human error; no traceability | Add approval gate; use Terraform Cloud or equivalent | medium | ops |

---

## 7. Production Readiness Verdict

### **NOT READY**

This platform **must not** be deployed to production. Critical failures (hardcoded credentials, public database, unrestricted SSH/PostgreSQL) represent immediate security and compliance violations. Remediate all critical and high-risk findings before re-evaluation.

---

## Next Steps

1. Fix CF-1 through CF-4 immediately.
2. Add Secrets Manager; remove all hardcoded secrets.
3. Move database to private subnet; restrict security groups.
4. Enable CloudTrail; add tagging; integrate scanning into CI.
5. Re-run this checklist after remediation.
