---
name: security-review
description: Reviews IaC, IAM policies, Kubernetes RBAC, and application configs for security posture. Covers least privilege, secrets management, encryption, audit logging, supply chain. Use when assessing IAM, secrets, encryption, or security posture of AWS/K8s workloads.
risk_tier: 1
---

# Security Review

Specialist skill for security assessment of infrastructure repositories. Evaluates IAM, secrets, encryption, and compliance posture.

## When to Use

- User asks for security review, IAM assessment, or secrets/encryption check
- User mentions least privilege, wildcards, Secrets Manager, KMS
- Focused security evaluation (invoked by orchestrator or standalone)

## Required Detection Areas

Run all five per `docs/security-analysis.md`. Each finding **must** include: **evidence**, **impact**, **remediation**.

1. **Missing IAM roles** — No aws_iam_role for workloads
2. **Overly permissive policies** (if present) — Wildcards in Action/Resource
3. **Missing encryption** (S3, RDS, EBS) — No server_side_encryption, storage_encrypted
4. **Missing Secrets Manager usage** — Hardcoded secrets; no aws_secretsmanager_secret
5. **Missing network isolation** — 0.0.0.0/0; no private subnets; no VPC endpoints

## Evaluation Domains

### Identity & Access

- IAM roles and policies (least privilege, wildcard detection)
- Role trust relationships
- Human vs workload identity separation
- Kubernetes RBAC, ServiceAccounts

### Secrets & Encryption

- Secrets management (Secrets Manager, Parameter Store, vaults)
- Encryption at rest (KMS, S3, RDS, EBS)
- Encryption in transit (TLS, HTTPS)
- Hardcoded secrets detection

### Audit & Compliance

- CloudTrail, audit logging
- S3 access logs
- Supply chain (SBOM, image scanning)

## Output Format

1. Security score (0–10)
2. Top security findings (ranked by severity)
3. IAM findings (wildcards, trust, least privilege)
4. Secrets and encryption findings
5. Remediation plan

## Evidence Labels

Observed / Inferred / Missing Evidence

## Additional Resources

- [reference.md](reference.md)
- [sample-output-report.md](sample-output-report.md)
- [prompt-template.md](prompt-template.md)
