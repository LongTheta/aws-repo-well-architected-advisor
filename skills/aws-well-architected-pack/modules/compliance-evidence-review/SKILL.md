---
name: compliance-evidence-review
description: Analyzes IaC, IAM, Kubernetes, and CI/CD for NIST SP 800-53, Zero Trust (800-207), FedRAMP alignment. Maps findings to control families (AC, IA, SC, AU, SI, CM, IR). Evidence-based; never assume compliance. Use when evaluating NIST compliance, FedRAMP readiness, or federal-grade requirements.
risk_tier: 1
---

# Compliance Evidence Review

Evaluates repos against NIST standards and federal Zero Trust principles.

## Purpose

Map repo evidence to NIST control families. Assess Zero Trust maturity. Produce FedRAMP readiness estimate. Never assume compliance without evidence.

## Triggers

- User asks for NIST compliance, FedRAMP readiness, or federal-grade assessment
- User mentions DoD, ATO, Zero Trust, control families
- Deep-review or regulated-review mode

## Inputs

- Artifact inventory
- Inferred architecture
- All module findings (security, networking, DevOps, etc.)

## Review Questions

- What evidence exists for AC (Access Control), IA (Identification/Auth)?
- What evidence for SC (System/Communications Protection)?
- What evidence for AU (Audit), SI (System Integrity), CM (Config), IR (Incident Response)?
- Is Zero Trust alignment evidenced per NIST 800-207?
- Can FedRAMP readiness be estimated from evidence?

## Evidence to Look For

| Control Family | Evidence |
|----------------|----------|
| AC (Access Control) | IAM, RBAC, least privilege |
| IA (Identification/Auth) | MFA, trust, identity |
| SC (System/Communications) | Encryption, subnets, private endpoints |
| AU (Audit) | CloudTrail, logs, retention |
| SI (System Integrity) | Scanning, patching |
| CM (Configuration) | IaC, GitOps, drift |
| IR (Incident Response) | Runbooks, alerts, isolation |

## Scoring Contribution

- **Compliance Evidence Quality** (10% weight): Score 0–10 based on evidence coverage, gaps, FedRAMP estimate

## Expected Output

1. Executive compliance summary
2. NIST control coverage map
3. Top compliance gaps
4. Zero Trust maturity assessment
5. Detailed findings with file-level evidence
6. Remediation plan mapped to NIST controls
7. FedRAMP readiness estimate (Low / Moderate / High)
8. All findings tagged: evidence_type, confidence, severity; never assume compliance
