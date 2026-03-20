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

## Required Detection Areas

Run all five per `docs/security-analysis.md`. Each finding **must** include: **evidence**, **impact**, **remediation**.

| # | Detection | Evidence | Impact | Remediation |
|---|-----------|----------|--------|-------------|
| 1 | **Missing IAM roles** | File paths searched; explicit absence | Blast radius; least privilege impossible | Create iam.tf with roles |
| 2 | **Overly permissive policies** (if present) | File:line; quoted Action/Resource | Lateral movement; data exfiltration | Replace wildcards with specific actions |
| 3 | **Missing encryption** (S3, RDS, EBS) | Resource and file; no encryption config | Data at rest exposed; compliance failure | Add server_side_encryption, storage_encrypted |
| 4 | **Missing Secrets Manager usage** | No aws_secretsmanager; hardcoded/plaintext | No rotation; credential sprawl | Migrate to Secrets Manager |
| 5 | **Missing network isolation** | Subnet layout; sg rules; 0.0.0.0/0 | Workloads exposed; lateral movement | Private subnets; restrict sg ingress |

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
2. Top security findings (ranked by severity) — **each with evidence, impact, remediation**
3. IAM findings (missing roles, overly permissive policies)
4. Encryption findings (S3, RDS, EBS)
5. Secrets Manager usage (or absence)
6. Network isolation (subnets, security groups)
7. Remediation plan
8. All findings tagged: evidence_type, confidence, severity
