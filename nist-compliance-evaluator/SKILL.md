---
name: nist-compliance-evaluator
description: Analyzes infrastructure repos, application configs, IAM policies, Kubernetes manifests, and CI/CD pipelines for NIST SP 800-53, 800-207 (Zero Trust), 800-190 (Container Security), and CIS Benchmarks alignment. Produces compliance scorecard, Zero Trust maturity, FedRAMP readiness estimate. Use when evaluating NIST compliance, Zero Trust, FedRAMP readiness, federal security controls, or CIS benchmarks.
risk_tier: 1
---

# NIST Compliance Evaluator

Analyzes infrastructure repositories, application configs, IAM policies, Kubernetes manifests, and CI/CD pipelines to evaluate alignment with NIST standards and federal Zero Trust principles.

## When to Use

- User asks to evaluate NIST compliance, Zero Trust alignment, or FedRAMP readiness
- User mentions NIST SP 800-53, 800-207, 800-190, CIS Benchmarks
- User needs compliance assessment of IaC, IAM, K8s, or CI/CD
- User wants federal security control mapping or gap analysis

## Frameworks

| Framework | Scope |
|-----------|-------|
| **NIST SP 800-53** | Security and privacy controls (AC, IA, SC, AU, SI, CM, IR families) |
| **NIST SP 800-207** | Zero Trust Architecture principles |
| **NIST SP 800-190** | Container Security guidelines |
| **CIS Benchmarks** | AWS, Linux, Kubernetes hardening |

## Evaluation Domains

### 1. Identity & Access (NIST AC, IA)

- IAM roles and policies (least privilege, wildcard detection)
- Role trust relationships
- Human vs workload identity separation
- MFA enforcement (if detectable)
- Service account usage in Kubernetes

### 2. Network Security (NIST SC)

- Public vs private subnet exposure
- Security group and firewall rules
- Ingress/egress controls
- Zero Trust assumptions (deny by default)
- Private endpoints vs public services

### 3. Data Protection (NIST SC, IA)

- Encryption at rest (KMS usage)
- Encryption in transit (TLS assumptions)
- Secrets management (Secrets Manager, env vars, vaults)
- Hardcoded secrets detection

### 4. Logging & Monitoring (NIST AU, SI)

- Centralized logging presence
- Audit trail capability (CloudTrail, etc.)
- Alerting capability
- Log retention configuration

### 5. Container & Workload Security (NIST 800-190)

- Image scanning (Trivy, etc.)
- Root container usage
- Privileged containers
- Kubernetes RBAC
- Pod security standards

### 6. Configuration & Drift (NIST CM)

- Infrastructure as Code usage
- Drift detection (GitOps / Argo CD)
- Config validation tools (OPA, Checkov, tfsec)

### 7. Incident Response (NIST IR)

- Evidence of runbooks or automation
- Alert → response linkage
- Isolation capability (network/IAM)

## Review Modules (Run in Order)

1. **Repo Discovery** — Inventory IaC, K8s manifests, CI/CD, IAM configs
2. **Identity & Access Review** — IAM, RBAC, trust, MFA signals
3. **Network Security Review** — Subnets, SGs, NACLs, endpoints
4. **Data Protection Review** — Encryption, secrets, hardcoded values
5. **Logging & Monitoring Review** — Logs, audit, alerts, retention
6. **Container Security Review** — Images, root/privileged, RBAC, PSS
7. **Configuration & Drift Review** — IaC, GitOps, validation tools
8. **Incident Response Review** — Runbooks, alert linkage, isolation
9. **Scoring & Reporting** — Map to NIST controls, Zero Trust maturity, FedRAMP estimate

## Scoring Model

- **Per-domain score**: 0–10
- **NIST control mapping**: AC, IA, SC, AU, SI, CM, IR families
- **Severity**: Critical / High / Medium / Low
- **Confidence**: Confirmed / Inferred / Missing Evidence

## Mandatory Rules

- **Never assume compliance without evidence** — If not found, state "Missing Evidence" or "Non-compliant"
- **Clearly distinguish** — Missing (no evidence) vs Non-compliant (evidence of violation)
- **Prioritize** — Identity, network isolation, and logging above other domains

## Output Format

Produce the report in this order. See [sample-output-report.md](sample-output-report.md) for a full example.

```markdown
# NIST Compliance Evaluation — [Repo Name]

## 1. Executive Compliance Summary
[Overall posture, FedRAMP readiness estimate, top gaps, key recommendations]

## 2. NIST Control Coverage Map
| Control Family | Domain | Score (0–10) | Status |
|----------------|--------|--------------|--------|
| AC, IA | Identity & Access | | |
| SC | Network Security | | |
| SC, IA | Data Protection | | |
| AU, SI | Logging & Monitoring | | |
| 800-190 | Container & Workload | | |
| CM | Configuration & Drift | | |
| IR | Incident Response | | |

## 3. Top Compliance Gaps
[Ranked by severity; each with NIST control, evidence, confidence]

## 4. Zero Trust Maturity Assessment
[Per NIST 800-207: identity, device, network, app/workload, data, visibility/analytics]

## 5. Detailed Findings with File-Level Evidence
[Per domain; file paths, line refs, evidence tag]

## 6. Remediation Plan Mapped to NIST Controls
| Gap | NIST Control | Remediation | Priority |
|-----|--------------|-------------|----------|
| ... | ... | ... | ... |

## 7. FedRAMP Readiness Estimate
**Estimate**: Low / Moderate / High
[Rationale based on control coverage and gaps]
```

## Evidence Labels

| Label | Meaning |
|-------|---------|
| **Confirmed** | Direct evidence in repo |
| **Inferred** | Derived from patterns or partial evidence |
| **Missing Evidence** | No evidence; cannot assume compliance |

## Additional Resources

- [reference.md](reference.md) — Domain specs, control mappings, evidence sources
- [scoring-rubric.md](scoring-rubric.md) — Per-domain scoring criteria
- [prompt-template.md](prompt-template.md) — Invocation template
- [sample-output-report.md](sample-output-report.md) — Full report example
