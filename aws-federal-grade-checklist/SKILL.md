---
name: aws-federal-grade-checklist
description: Evaluates AWS repositories, infrastructure-as-code (Terraform, CDK, CloudFormation), and deployment pipelines against federal-grade expectations. Aligned to AWS Well-Architected, NIST SP 800-53, FedRAMP, DoD DevSecOps/Zero Trust, and FinOps. High-strictness, production-readiness skill. Use when reviewing AWS repos, IaC, CI/CD, pre-production, or regulated workloads.
risk_tier: 1
---

# AWS Federal-Grade Checklist

Evaluates AWS repositories, infrastructure-as-code, and deployment pipelines against federal-grade expectations aligned to AWS Well-Architected, NIST SP 800-53, FedRAMP, DoD DevSecOps/Zero Trust, and FinOps. **High-strictness, production-readiness skill.**

## When to Use

- Reviewing AWS application or platform repositories
- Assessing Terraform, CDK, or CloudFormation
- Evaluating CI/CD pipelines for AWS deployments
- Performing pre-production or security reviews
- Validating compliance posture for regulated workloads

## What This Skill Inspects

- Infrastructure as Code (Terraform, Terragrunt, CDK, CloudFormation)
- IAM roles, policies, and trust relationships
- Networking configurations (VPC, subnets, security groups)
- Secrets handling
- CI/CD pipelines
- Logging and monitoring signals
- Backup and recovery patterns
- Resource tagging and governance
- EKS-related manifests (if present)

## Evaluation Categories (10)

### 1. Identity & Access Management (AC, IA)
- IAM roles over users
- Least privilege enforced
- No wildcard permissions
- MFA for privileged users
- No hardcoded credentials

### 2. Secrets Management (IA, SC)
- Secrets Manager or SSM Parameter Store
- No plaintext secrets in repo
- KMS encryption used

### 3. Logging & Audit (AU)
- CloudTrail enabled
- Logs retained and accessible
- Audit visibility for key actions

### 4. Network Security (SC)
- Minimal public exposure
- No open ports (0.0.0.0/0) without justification
- Private subnets for sensitive services

### 5. Data Protection (SC, CP)
- Encryption at rest and in transit
- Backup strategy exists
- Data classification awareness

### 6. Vulnerability Management (SI)
- Dependency scanning
- Container/image scanning
- Patch/update process

### 7. DevSecOps Pipeline
- CI/CD present
- Security scanning integrated
- IaC used
- Minimal manual deployments

### 8. Zero Trust Alignment
- Identity-based access
- Segmentation
- No implicit trust zones

### 9. Tagging & Governance
Required tags: Project, Environment, Owner, CostCenter, ManagedBy, Purpose, DataClassification, Lifecycle

### 10. Resilience & Recovery (CP)
- Multi-AZ awareness
- Backup and restore strategy
- Failover considerations

See `checklist.yaml` for full criteria. See `scoring-rubric.md` for scoring rules.

## Output Format

1. Executive Summary
2. Category Score Table
3. Critical Failures
4. High-Risk Findings
5. Compliance Gaps (NIST mapped)
6. Remediation Plan
7. Production Readiness Verdict: NOT READY / CONDITIONAL / READY

## Mandatory Rules

- **Be strict and evidence-based**
- **Do not assume controls exist** — Missing evidence lowers confidence and may raise risk
- **Flag missing evidence explicitly**
- **Prioritize security over cost**
- **Treat secrets exposure, wildcard IAM, and public data exposure as critical**
- **Treat missing tags as governance failure**
- **Provide actionable remediations** — Not generic advice
- **Distinguish observed vs inferred** — Tag evidence_type

## Evidence Labels

| evidence_type | Meaning |
|---------------|---------|
| observed | Direct evidence in repo |
| inferred | Derived from patterns |
| missing | No evidence; cannot assume compliance |
| contradictory | Conflicting signals |

## Severity

| Severity | When |
|----------|------|
| critical | Must fix before production |
| high | Significant gap; prioritize |
| medium | Important improvement |
| low | Nice to have |

## Files in This Skill

| File | Purpose |
|------|---------|
| `SKILL.md` | This file — main skill instructions |
| `README.md` | Overview, when to use, limitations |
| `checklist.yaml` | Machine-readable evaluation criteria |
| `scoring-rubric.md` | Per-category scoring rules |
| `example-input.md` | Weak repo + strong repo examples |
| `example-output.md` | Full report with findings and verdict |

## End State

This skill functions as a **federal-grade AWS architecture and DevSecOps validation layer** inside an AI IDE, enforcing production readiness and compliance-level rigor.
