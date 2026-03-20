# Terraform Deployment Checklist (Enforced)

When generating Terraform (scaffold, incremental-fix, patches), agents MUST ensure these requirements. See `docs/terraform-apply-order.md` for apply-order rules.

---

## Pre-Deploy Requirements

| Requirement | Why | If Missing |
|-------------|-----|------------|
| **Remote backend** | S3 + DynamoDB for state and locking; avoid local state loss | `terraform init` may use local state; no locking |
| **IAM execution policy** | Terraform needs EKS, RDS, VPC, ECR, Secrets Manager, KMS, CloudTrail, etc. | Apply fails with permission errors |
| **Secrets outside state** | RDS password, API keys in state = compliance risk | Use Secrets Manager or SSM SecureString; avoid `random_password` for prod DB |
| **Globally unique names** | S3, CloudTrail bucket names are global | `BucketAlreadyExists` on apply |
| **EKS IAM attachments** | When scaffolding EKS, **create** `aws_iam_role_policy_attachment` for cluster + node policies (AmazonEKSClusterPolicy, AmazonEKSWorkerNodePolicy, etc.) | Apply fails; cluster/node cannot assume role |
| **KMS for encrypted resources** | When scaffolding RDS, Secrets Manager, S3, CloudTrail — **create** `aws_kms_key` and wire `kms_key_id`, `enable_key_rotation = true` | Default AWS keys; no compliance audit trail |
| **Backend bootstrap** | S3 bucket and DynamoDB table must exist before first `terraform init` | Chicken-and-egg; provide `bootstrap-backend.sh` or equivalent |

---

## Required Outputs When Generating Terraform

When producing Terraform patches or scaffolds for an assessed repo, include:

1. **`terraform/iam-execution-policy.json`** — IAM policy document for the role/user running `terraform apply`. Prefer resource ARNs over `"Resource": "*"` per `docs/iam-least-privilege.md`.
2. **`docs/iam-execution-requirements.md`** — How to attach the policy, use assume-role, or configure CI
3. **`backend "s3"` block** — With comment: configure via `-backend-config=backend.hcl` or equivalent
4. **Bootstrap instructions** — How to create S3 bucket + DynamoDB table for state before first apply

---

## Uniqueness Patterns

| Resource | Pattern | Example |
|----------|---------|---------|
| S3 bucket | `random_id` suffix | `${var.project}-${var.env}-assets-${random_id.suffix.hex}` |
| CloudTrail bucket | `random_id` suffix | `${var.project}-cloudtrail-${random_id.suffix.hex}` |
| DynamoDB table | `random_id` suffix | `${var.project}-cache-${random_id.suffix.hex}` |
| RDS identifier | `random_id` suffix | `${var.project}-db-${random_id.suffix.hex}` |

---

## DRY (Don't Repeat Yourself)

When generating Terraform, avoid duplication:

| Pattern | Use | Avoid |
|---------|-----|-------|
| Repeated resource blocks | `module` with `count` or `for_each` | Copy-paste of similar resources |
| Shared values (tags, naming) | `locals { }` | Inline repetition |
| Common patterns (S3, RDS) | Community or internal modules | Duplicated config across envs |

---

## Production Guardrails

For production workloads, see `docs/terraform-production-guardrails.md`:

- RDS: `skip_final_snapshot = false`; consider `multi_az = true`
- EKS: `eks_endpoint_public_access = false` or restrict to VPC CIDR
- Avoid default VPC for production

---

## Validation

- `npm run validate:terraform` — CloudTrail depends_on
- `npm run validate:terraform:deploy` — Backend, secrets in state, S3/CloudTrail uniqueness, skip_final_snapshot

---

## See Also

- `docs/terraform-architect-rules.md` — Core principles, naming, tags
- `docs/terraform-iam-patterns.md` — Prefer AWS managed policies (EKS, RDS, Lambda, ECS)
- `docs/terraform-kms-patterns.md` — Create KMS keys for RDS, Secrets Manager, S3, CloudTrail
- `docs/terraform-apply-order.md` — Apply order and depends_on
- `docs/terraform-production-guardrails.md` — Production safety
- `docs/iam-least-privilege.md` — Avoid Resource: "*"; use ARN patterns (ELB, S3, EKS)
- `docs/compliance-mapping.md` — Secrets in state gap
