# Compliance Mapping

Evidence-based mapping of repository practices to NIST and DoD concepts. **This document describes alignment evidence, not certification.**

---

## Scope

This mapping applies to the patterns and artifacts present in this repository (e.g. IaC samples, schemas, runbooks). It does **not** constitute formal compliance, FedRAMP authorization, or ATO.

---

## Observed Controls / Practices

| Practice | Evidence | Location |
|----------|----------|----------|
| Encryption at rest (S3) | `aws_s3_bucket_server_side_encryption_configuration` with AES256 | examples/terraform-sample/main.tf |
| Encryption at rest (RDS) | `storage_encrypted = true` | examples/terraform-sample/main.tf |
| IAM least privilege | Role with scoped S3 actions | examples/terraform-sample/main.tf |
| Cost allocation tags | `Environment`, `Project`, `CostCenter` on resources | examples/terraform-sample/main.tf |
| CloudWatch logging | Lambda log group, RDS `enabled_cloudwatch_logs_exports` | examples/terraform-sample |
| Evidence model | `evidence_type`, `confidence_score` | docs/evidence-model.md |

---

## Inferred Practices

| Practice | Basis | Confidence |
|----------|-------|------------|
| Access control intent | IAM role with assume_role_policy | Inferred from structure |
| Operational visibility | Alarms for Lambda, RDS | Inferred from observability.tf |
| Naming consistency | `{resource}-{metric}-{threshold}` | Inferred from alarm naming |

---

## Missing Practices

| Practice | Gap | Recommendation |
|----------|-----|-----------------|
| Secrets management | RDS password in Terraform state | Use Secrets Manager or SSM SecureString |
| VPC endpoints | S3/DynamoDB via public endpoint | Add VPC endpoints for cost/security |
| Backup retention | RDS `skip_final_snapshot` in dev | Document prod backup policy |
| Audit logging | No CloudTrail/VPC Flow Logs in sample | Add per workload requirements |

---

## NIST Mapping (Practical)

| NIST Control Family | Observed | Inferred | Missing |
|---------------------|----------|----------|---------|
| AC (Access Control) | IAM roles | Least privilege intent | — |
| SC (System/Communications) | Encryption at rest | — | VPC endpoints |
| AU (Audit) | CloudWatch logs | — | CloudTrail, Flow Logs |
| IA (Identification/Auth) | IAM assume role | — | MFA, rotation |
| CM (Config Management) | IaC, tags | — | — |
| IR (Incident Response) | Alarms | — | Runbook linkage |

---

## DoD Zero Trust Alignment

| Pillar | Evidence | Gap |
|--------|----------|-----|
| User | IAM roles | No MFA, device posture |
| Device | — | No device trust |
| Network | VPC, subnets | No micro-segmentation |
| Application | Lambda, ALB | — |
| Data | Encryption at rest | — |
| Visibility | CloudWatch | Limited analytics |
| Automation | IaC | — |

---

## Explicit Statement

**This mapping is alignment evidence based on repository artifacts. It does not constitute:**

- Compliance certification
- FedRAMP authorization
- ATO (Authority to Operate)
- Formal control assessment

Formal compliance requires assessment by an authorized body.

---

## See Also

- [docs/evidence-model.md](evidence-model.md)
- [docs/federal-mode.md](federal-mode.md)
