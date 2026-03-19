---
name: security-review
description: Reviews IaC, IAM policies, Kubernetes RBAC, and application configs for security posture. Covers least privilege, secrets management, encryption, audit logging, supply chain. Use when assessing IAM, secrets, encryption, or security posture of AWS/K8s workloads.
risk_tier: 1
---

# Security Review

Specialist skill for security assessment of infrastructure repositories.

## Purpose

Evaluate security posture across identity, secrets, encryption, and supply chain. Contribute to Security pillar scoring. Flag CRITICAL/HIGH findings that block production.

## Triggers

- User asks for security review, IAM assessment, or secrets/encryption check
- File patterns: Terraform, CDK, K8s, IAM policies, `.env*`
- Content patterns: wildcard IAM, secrets exposure, public exposure

## Inputs

- Artifact inventory
- Inferred architecture
- IaC files, IAM policies, K8s manifests, app configs

## Review Questions

- Are IAM policies least-privilege? Any wildcards?
- Are secrets in Secrets Manager/Parameter Store or hardcoded?
- Is encryption at rest configured? (KMS, S3, RDS, EBS)
- Is encryption in transit enforced? (TLS, HTTPS)
- Is there audit logging? (CloudTrail, S3 access logs)
- Is supply chain secured? (SBOM, image scanning)

## Evidence to Look For

| Domain | Evidence |
|--------|----------|
| Identity & Access | IAM roles, policies, trust relationships, RBAC, ServiceAccounts |
| Secrets | Secrets Manager, Parameter Store, vaults, hardcoded detection |
| Encryption at rest | KMS, S3 encryption, RDS encryption, EBS encryption |
| Encryption in transit | TLS config, HTTPS, security group rules |
| Audit | CloudTrail, S3 access logs, audit config |
| Supply chain | Image scanning, SBOM, dependency checks |

## Scoring Contribution

- **Security** (20% weight): Score 0–10 based on findings; CRITICAL/HIGH reduce score significantly

## Expected Output

1. Security score (0–10)
2. Top security findings (ranked by severity)
3. IAM findings (wildcards, trust, least privilege)
4. Secrets and encryption findings
5. Remediation plan
6. All findings tagged: evidence_type, confidence, severity
