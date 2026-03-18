# NIST Compliance Evaluator

An AI skill that analyzes infrastructure repositories, application configs, IAM policies, Kubernetes manifests, and CI/CD pipelines for alignment with NIST standards and federal Zero Trust principles.

## Overview

This skill evaluates repos against:

| Framework | Scope |
|-----------|-------|
| **NIST SP 800-53** | Security controls (AC, IA, SC, AU, SI, CM, IR) |
| **NIST SP 800-207** | Zero Trust Architecture |
| **NIST SP 800-190** | Container Security |
| **CIS Benchmarks** | AWS, Linux, Kubernetes |

## Evaluation Domains

1. **Identity & Access** (AC, IA) — IAM, RBAC, trust, MFA, wildcards
2. **Network Security** (SC) — Subnets, SGs, deny-by-default, private endpoints
3. **Data Protection** (SC, IA) — Encryption, secrets, hardcoded detection
4. **Logging & Monitoring** (AU, SI) — Centralized logs, audit, alerts, retention
5. **Container & Workload Security** (800-190) — Scanning, root/privileged, RBAC, PSS
6. **Configuration & Drift** (CM) — IaC, GitOps, OPA/Checkov/tfsec
7. **Incident Response** (IR) — Runbooks, alert linkage, isolation

## Key Features

- **Evidence-based** — Confirmed / Inferred / Missing Evidence; never assume compliance
- **NIST control mapping** — Findings mapped to AC, IA, SC, AU, SI, CM, IR
- **Zero Trust maturity** — Per-pillar assessment (NIST 800-207)
- **FedRAMP readiness** — Low / Moderate / High estimate
- **File-level evidence** — Paths and line refs for findings

## When to Use

- Evaluate NIST compliance, Zero Trust alignment, or FedRAMP readiness
- Assess IaC, IAM, K8s, or CI/CD for federal security controls
- Map gaps to NIST control families

## Output

1. Executive compliance summary  
2. NIST control coverage map  
3. Top compliance gaps  
4. Zero Trust maturity assessment  
5. Detailed findings with file-level evidence  
6. Remediation plan mapped to NIST controls  
7. FedRAMP readiness estimate  

## Scoring

- **Per-domain**: 0–10
- **Severity**: Critical / High / Medium / Low
- **Confidence**: Confirmed / Inferred / Missing Evidence

## Files in This Skill

| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill instructions |
| `README.md` | This overview |
| `reference.md` | Domain specs, control mappings |
| `scoring-rubric.md` | Per-domain scoring criteria |
| `prompt-template.md` | Invocation template |
| `sample-output-report.md` | Full example report |

## Installation

Store in `~/.cursor/skills/nist-compliance-evaluator/` for personal use, or `.cursor/skills/nist-compliance-evaluator/` for project scope. Cursor loads it when the description matches (e.g., "evaluate my repo for NIST compliance").

## Usage Example

```
Evaluate my infrastructure repo for NIST compliance. 
Focus on identity, network security, and data protection. 
Include FedRAMP readiness estimate and Zero Trust maturity.
```
