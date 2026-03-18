# NIST Compliance Scoring Rubric

Scores are 0–10 per domain. Higher = better NIST alignment. Never assume compliance without evidence.

## Identity & Access (AC, IA)

| Score | Criteria |
|-------|----------|
| 9–10 | Least privilege; no wildcards; human/workload separation; MFA enforced; K8s RBAC least privilege |
| 7–8 | Good IAM; minor wildcards; MFA present; K8s RBAC in place |
| 5–6 | Basic IAM; some broad policies; separation partial |
| 3–4 | Broad IAM; wildcards; no MFA; weak K8s RBAC |
| 0–2 | No least privilege; excessive wildcards; no separation; no RBAC |

**Key questions**: Least privilege? Wildcards? Trust boundaries? MFA? K8s RBAC?

## Network Security (SC)

| Score | Criteria |
|-------|----------|
| 9–10 | Deny by default; private subnets; minimal public exposure; SG least privilege; private endpoints |
| 7–8 | Good segmentation; SG scoped; some private endpoints |
| 5–6 | Basic segmentation; some 0.0.0.0/0; minimal private endpoints |
| 3–4 | Broad ingress; public exposure; weak SG rules |
| 0–2 | No segmentation; open 0.0.0.0/0; no private endpoints |

**Key questions**: Deny by default? Public exposure? SG least privilege? Private endpoints?

## Data Protection (SC, IA)

| Score | Criteria |
|-------|----------|
| 9–10 | KMS everywhere; TLS enforced; secrets in vault; no hardcoded secrets |
| 7–8 | Encryption in place; secrets managed; minor gaps |
| 5–6 | Partial encryption; some secrets in Parameter Store; no rotation |
| 3–4 | Default encryption only; secrets in env; possible hardcoded |
| 0–2 | No encryption; plaintext secrets; hardcoded credentials |

**Key questions**: KMS? TLS? Secrets vault? Hardcoded secrets?

## Logging & Monitoring (AU, SI)

| Score | Criteria |
|-------|----------|
| 9–10 | Centralized logging; CloudTrail; alerting; retention defined |
| 7–8 | Logging present; audit trail; alerts configured |
| 5–6 | Basic logging; partial audit; limited alerts |
| 3–4 | Minimal logging; no audit; no alerts |
| 0–2 | No logging; no audit; no alerts |

**Key questions**: Centralized logs? CloudTrail? Alerts? Retention?

## Container & Workload Security (800-190)

| Score | Criteria |
|-------|----------|
| 9–10 | Image scanning; non-root; no privileged; RBAC; PSS enforced |
| 7–8 | Scanning present; non-root; RBAC in place |
| 5–6 | Partial scanning; some root; basic RBAC |
| 3–4 | No scanning; root containers; weak RBAC |
| 0–2 | No scanning; privileged; no RBAC |

**Key questions**: Image scanning? Root/privileged? RBAC? PSS?

## Configuration & Drift (CM)

| Score | Criteria |
|-------|----------|
| 9–10 | Full IaC; GitOps; OPA/Checkov/tfsec in CI |
| 7–8 | IaC present; drift detection; validation tools |
| 5–6 | IaC present; limited drift; some validation |
| 3–4 | Partial IaC; no drift; no validation |
| 0–2 | No IaC; no drift; no validation |

**Key questions**: IaC? GitOps? Drift detection? Config validation?

## Incident Response (IR)

| Score | Criteria |
|-------|----------|
| 9–10 | Runbooks; alert → response; isolation capability |
| 7–8 | Runbooks present; alert linkage; isolation documented |
| 5–6 | Some runbooks; basic alerts |
| 3–4 | Minimal runbooks; no linkage |
| 0–2 | No runbooks; no alert linkage; no isolation |

**Key questions**: Runbooks? Alert → response? Isolation capability?

---

## Severity Classification

| Severity | Definition | Example |
|----------|------------|---------|
| Critical | Immediate compliance failure; blocks FedRAMP | Hardcoded secrets, no encryption |
| High | Significant gap; must fix for FedRAMP | Broad IAM, 0.0.0.0/0 ingress |
| Medium | Important improvement | Missing tagging, no image scanning |
| Low | Nice to have | Suboptimal retention |

## Confidence Classification

| Confidence | Definition |
|------------|------------|
| Confirmed | Direct evidence in repo |
| Inferred | Clear pattern from artifacts |
| Missing Evidence | No evidence; cannot assume compliance |

## FedRAMP Readiness Estimate

| Estimate | Criteria |
|----------|----------|
| **High** | Most controls present; minor gaps; identity, network, logging strong |
| **Moderate** | Many controls present; some gaps; remediation path clear |
| **Low** | Significant gaps; identity, network, or logging weak; major remediation needed |
