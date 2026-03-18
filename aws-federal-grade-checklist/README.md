# AWS Federal-Grade Checklist

An AI IDE skill that evaluates AWS repositories, infrastructure-as-code, and deployment pipelines against federal-grade expectations. **High-strictness, production-readiness skill.**

---

## Purpose

Evaluate AWS repositories, infrastructure-as-code (Terraform, CDK, CloudFormation), and deployment pipelines against federal-grade expectations aligned to:

- AWS Well-Architected Framework
- NIST SP 800-53 control families
- FedRAMP-style cloud security expectations
- DoD DevSecOps / Zero Trust principles
- FinOps governance and tagging standards

---

## When to Use

- Reviewing AWS application or platform repositories
- Assessing Terraform, CDK, or CloudFormation
- Evaluating CI/CD pipelines for AWS deployments
- Performing pre-production or security reviews
- Validating compliance posture for regulated workloads

---

## What It Inspects

- Infrastructure as Code (Terraform, CDK, CloudFormation)
- IAM roles, policies, and trust relationships
- Networking configurations (VPC, subnets, security groups)
- Secrets handling
- CI/CD pipelines
- Logging and monitoring signals
- Backup and recovery patterns
- Resource tagging and governance

---

## Evaluation Categories

1. **Identity & Access Management** (AC, IA) — IAM roles, least privilege, no wildcards, MFA, no hardcoded creds
2. **Secrets Management** (IA, SC) — Secrets Manager/SSM, no plaintext, KMS
3. **Logging & Audit** (AU) — CloudTrail, retention, audit visibility
4. **Network Security** (SC) — Minimal public exposure, no 0.0.0.0/0 without justification, private subnets
5. **Data Protection** (SC, CP) — Encryption, backup, data classification
6. **Vulnerability Management** (SI) — Dependency/container scanning, patch process
7. **DevSecOps Pipeline** — CI/CD, security scanning, IaC, minimal manual deploy
8. **Zero Trust Alignment** — Identity-based access, segmentation, no implicit trust
9. **Tagging & Governance** — Project, Environment, Owner, CostCenter, ManagedBy, Purpose, DataClassification, Lifecycle
10. **Resilience & Recovery** (CP) — Multi-AZ, backup/restore, failover

---

## Scoring

Each category scored 0–10:

| Score | Meaning |
|-------|---------|
| 9–10 | Compliant |
| 7–8 | Minor gaps |
| 5–6 | Moderate risk |
| 3–4 | High risk |
| 0–2 | Critical failure |

Findings must include:
- **severity** — critical / high / medium / low
- **confidence** — high / medium / low
- **evidence_type** — observed / inferred / missing / contradictory

---

## Frameworks Aligned To

| Framework | Scope |
|-----------|-------|
| **AWS Well-Architected** | 6 pillars |
| **NIST SP 800-53** | Control families AC, IA, AU, SC, CM, SI, CP, IR |
| **FedRAMP** | Cloud security expectations |
| **DoD DevSecOps** | Pipeline security, scanning, IaC |
| **DoD Zero Trust** | Identity-based access; least privilege |
| **FinOps** | Tagging; cost attribution |

---

## Example Use Cases

1. **Pre-production review** — "Is this AWS platform ready for production?"
2. **Federal compliance check** — "Does this meet FedRAMP-style expectations?"
3. **IaC security audit** — "Review this Terraform for federal-grade security"
4. **CI/CD pipeline review** — "Does this pipeline meet DoD DevSecOps expectations?"
5. **Platform design review** — "Evaluate this architecture description against NIST controls"

---

## Output Requirements

1. Executive Summary
2. Category Score Table
3. Critical Failures
4. High-Risk Findings
5. Compliance Gaps (NIST mapped)
6. Remediation Plan
7. Production Readiness Verdict: NOT READY / CONDITIONAL / READY

---

## Example Output Summary

```
Executive Summary
- Overall score: 52/100
- Risk level: High
- Critical failures: 2 (hardcoded secrets, public DB exposure)
- Verdict: NOT READY

Category Scores
- Identity & Access: 4 (High risk)
- Secrets Management: 2 (Critical)
- Logging & Audit: 5 (Moderate)
- Network Security: 3 (High risk)
...
```

See `example-output.md` for a full report.

---

## Rules

- Be strict and evidence-based
- Do not assume controls exist
- Flag missing evidence explicitly
- Prioritize security over cost
- Treat secrets exposure, wildcard IAM, and public data exposure as critical
- Treat missing tags as governance failure

---

## Limitations

| Limitation | Explanation |
|------------|-------------|
| **Cannot prove runtime configuration** | Repo analysis cannot confirm what is actually running in AWS |
| **Cannot prove account settings** | CloudTrail, MFA, SCPs may be configured outside the repo |
| **Missing evidence** | When evidence is absent, the skill labels it explicitly and may raise risk |
| **Inference vs observation** | Inferred conclusions are labeled; only observed facts are treated as confirmed |

---

## End State

This skill functions as a **federal-grade AWS architecture and DevSecOps validation layer** inside an AI IDE, enforcing production readiness and compliance-level rigor.

---

## Installation

Store in `~/.cursor/skills/aws-federal-grade-checklist/` for personal use, or `.cursor/skills/aws-federal-grade-checklist/` for project scope. Cursor loads it when the description matches (e.g., "evaluate my AWS repo for federal compliance").

---

## Usage Example

```
Evaluate this AWS repository against federal-grade standards.
Use the aws-federal-grade-checklist skill.
Include NIST control mapping and production readiness verdict.
```
