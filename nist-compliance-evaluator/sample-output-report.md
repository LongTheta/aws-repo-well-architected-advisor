# Sample Output Report

Example of a full NIST compliance evaluation report produced by the skill.

---

# NIST Compliance Evaluation — federal-workload-app

**Repository**: `federal-workload-app`  
**Evaluation Date**: 2025-03-18  
**Evaluator**: NIST Compliance Evaluator

---

## 1. Executive Compliance Summary

The `federal-workload-app` repository contains Terraform-managed AWS infrastructure with EKS workloads. **Identity and network security** show moderate alignment with NIST 800-53; **data protection** has gaps (secrets in Parameter Store without rotation, no KMS CMK). **Logging and monitoring** are partially implemented (CloudWatch present; CloudTrail status inferred). **Container security** lacks image scanning in CI and some workloads run as root. **Configuration management** is strong (IaC, GitOps); **incident response** has minimal runbook evidence.

**FedRAMP Readiness Estimate**: **Moderate** — Remediation of identity (least privilege), data protection (secrets rotation, KMS), and container security (scanning, non-root) would move toward High.

**Top recommendations**: (1) Restrict IAM to least privilege, remove wildcards; (2) Migrate secrets to Secrets Manager with rotation; (3) Add image scanning and enforce non-root containers; (4) Document and implement runbooks; (5) Confirm CloudTrail and log retention.

---

## 2. NIST Control Coverage Map

| Control Family | Domain | Score (0–10) | Status |
|----------------|--------|--------------|--------|
| AC, IA | Identity & Access | 5 | Gaps: wildcards, MFA not enforced |
| SC | Network Security | 6 | Gaps: some 0.0.0.0/0; limited private endpoints |
| SC, IA | Data Protection | 5 | Gaps: no rotation; default encryption |
| AU, SI | Logging & Monitoring | 5 | Gaps: retention unclear; alert coverage partial |
| 800-190 | Container & Workload | 4 | Gaps: no scanning; root containers |
| CM | Configuration & Drift | 7 | IaC present; GitOps; validation partial |
| IR | Incident Response | 3 | Gaps: minimal runbook evidence |

**Overall average**: 5.0/10

---

## 3. Top Compliance Gaps

| Rank | Gap | NIST Control | Severity | Confidence | Evidence |
|------|-----|--------------|----------|------------|----------|
| 1 | ECS task role has `s3:*` — least privilege violation | AC-6 | Critical | Confirmed | `iam.tf:42` |
| 2 | Secrets in Parameter Store; no rotation | IA-5 | High | Inferred | `variables.tf` refs |
| 3 | No image scanning in CI pipeline | 800-190 | High | Confirmed | `.github/workflows/` |
| 4 | Pod runs as root (`runAsUser` not set) | 800-190 | High | Confirmed | `deployment.yaml:18` |
| 5 | Security group allows 0.0.0.0/0 on port 443 | SC-7 | High | Confirmed | `security_groups.tf:12` |
| 6 | No KMS customer-managed key for RDS | SC-13, SC-28 | Medium | Confirmed | `rds.tf` |
| 7 | CloudTrail status not evident in IaC | AU-2 | Medium | Missing Evidence | — |
| 8 | No runbook or incident response automation | IR-4, IR-6 | Medium | Missing Evidence | — |
| 9 | Log retention not configured | AU-9 | Medium | Inferred | — |
| 10 | MFA not enforced for IAM users | IA-2 | Medium | Missing Evidence | — |

---

## 4. Zero Trust Maturity Assessment

| Pillar | Maturity | Evidence |
|--------|----------|----------|
| **Identity** | Partial | IAM roles present; workload identity used; MFA not enforced (Missing Evidence) |
| **Device** | N/A | Not applicable (serverless/container workload) |
| **Network** | Partial | Private subnets; some 0.0.0.0/0; VPC endpoints for S3 (Observed) |
| **Application/Workload** | Partial | ECS task roles; broad permissions (Gap) |
| **Data** | Partial | TLS on ALB; default RDS encryption; secrets not rotated (Gap) |
| **Visibility & Analytics** | Partial | CloudWatch logs; alerting partial; CloudTrail status unclear |

**Overall Zero Trust maturity**: **Traditional** — Moving toward Target; identity and network micro-segmentation need improvement.

---

## 5. Detailed Findings with File-Level Evidence

### Identity & Access (AC, IA)

| ID | Finding | File:Line | Evidence |
|----|---------|-----------|----------|
| IA-1 | ECS task role policy uses `s3:*` | `infra/iam.tf:42` | Confirmed |
| IA-2 | No MFA condition in IAM policies | — | Missing Evidence |
| IA-3 | K8s ServiceAccount used for workload | `k8s/deployment.yaml:12` | Confirmed |
| IA-4 | Trust policy allows ECS tasks | `infra/iam.tf:35` | Confirmed |

### Network Security (SC)

| ID | Finding | File:Line | Evidence |
|----|---------|-----------|----------|
| SC-1 | ALB security group allows 0.0.0.0/0:443 | `infra/security_groups.tf:12` | Confirmed |
| SC-2 | VPC endpoints for S3, ECR | `infra/vpc.tf:88` | Confirmed |
| SC-3 | Private subnets for ECS, RDS | `infra/vpc.tf:45` | Confirmed |

### Data Protection (SC, IA)

| ID | Finding | File:Line | Evidence |
|----|---------|-----------|----------|
| DP-1 | RDS uses default encryption | `infra/rds.tf:22` | Confirmed |
| DP-2 | Secrets in SSM Parameter Store | `app/config.py:8` | Confirmed |
| DP-3 | No hardcoded secrets in scanned files | — | Inferred |
| DP-4 | ALB listener TLS 1.2+ | `infra/ecs.tf:55` | Confirmed |

### Logging & Monitoring (AU, SI)

| ID | Finding | File:Line | Evidence |
|----|---------|-----------|----------|
| AU-1 | CloudWatch log group for ECS | `infra/ecs.tf:72` | Confirmed |
| AU-2 | CloudTrail not in IaC | — | Missing Evidence |
| AU-3 | Log retention not set | `infra/ecs.tf:72` | Confirmed |
| SI-1 | CloudWatch alarm for 5xx | `infra/alarms.tf:5` | Confirmed |

### Container & Workload Security (800-190)

| ID | Finding | File:Line | Evidence |
|----|---------|-----------|----------|
| C-1 | No Trivy/ECR scan in CI | `.github/workflows/deploy.yml` | Confirmed |
| C-2 | Pod spec lacks `runAsNonRoot` | `k8s/deployment.yaml:18` | Confirmed |
| C-3 | No privileged containers | `k8s/deployment.yaml` | Confirmed |
| C-4 | RBAC Role for app namespace | `k8s/rbac.yaml` | Confirmed |

### Configuration & Drift (CM)

| ID | Finding | File:Line | Evidence |
|----|---------|-----------|----------|
| CM-1 | Terraform for all infra | `infra/*.tf` | Confirmed |
| CM-2 | Argo CD Application present | `argocd/app.yaml` | Confirmed |
| CM-3 | tfsec in CI | `.github/workflows/validate.yml:12` | Confirmed |

### Incident Response (IR)

| ID | Finding | File:Line | Evidence |
|----|---------|-----------|----------|
| IR-1 | No runbook in repo | — | Missing Evidence |
| IR-2 | Alarms route to SNS | `infra/alarms.tf:15` | Confirmed |
| IR-3 | No isolation automation | — | Missing Evidence |

---

## 6. Remediation Plan Mapped to NIST Controls

| Gap | NIST Control | Remediation | Priority |
|-----|--------------|-------------|----------|
| ECS role `s3:*` | AC-6 | Restrict to bucket/prefix | P1 |
| Secrets no rotation | IA-5 | Migrate to Secrets Manager; enable rotation | P1 |
| No image scanning | 800-190 | Add Trivy to CI; block on HIGH/CRITICAL | P1 |
| Root container | 800-190 | Add `runAsNonRoot: true`, `runAsUser` | P1 |
| SG 0.0.0.0/0 | SC-7 | Restrict to known IP ranges or WAF | P1 |
| No KMS CMK for RDS | SC-13, SC-28 | Create KMS key; enable for RDS | P2 |
| CloudTrail not in IaC | AU-2 | Add CloudTrail to Terraform | P2 |
| No runbooks | IR-4, IR-6 | Document runbooks; add to repo | P2 |
| Log retention | AU-9 | Set retention on log groups | P2 |
| MFA | IA-2 | Enforce MFA in IAM policies | P3 |

---

## 7. FedRAMP Readiness Estimate

**Estimate**: **Moderate**

**Rationale**:
- **Identity (AC, IA)**: Gaps in least privilege and MFA reduce readiness; workload identity present.
- **Network (SC)**: Private subnets and VPC endpoints support; 0.0.0.0/0 ingress is a gap.
- **Data (SC, IA)**: TLS present; encryption at rest default; secrets rotation and KMS CMK needed.
- **Logging (AU, SI)**: Partial; CloudTrail and retention must be confirmed.
- **Containers (800-190)**: Image scanning and non-root are required for Moderate.
- **Configuration (CM)**: Strong IaC and GitOps.
- **Incident Response (IR)**: Runbooks and linkage need development.

**Path to High**: Address P1 gaps (identity, secrets, scanning, root containers, SG); add CloudTrail and runbooks; then reassess.

---

*End of sample report*
