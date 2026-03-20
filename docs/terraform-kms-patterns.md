# Terraform KMS Patterns

When scaffolding Terraform, **create customer-managed KMS keys** for every encrypted resource. Do not rely on default AWS-managed keys. If you scaffold RDS, Secrets Manager, S3, or CloudTrail, you must create and wire the KMS keys.

---

## Rule

**Create:** `aws_kms_key` (and `aws_kms_alias`) for each encrypted service you scaffold.

**Wire:** `kms_key_id` (or equivalent) on RDS, Secrets Manager, S3, CloudTrail.

**Apply order:** KMS keys must exist before resources that reference them. See `docs/terraform-apply-order.md` §5.

---

## Resource → KMS Mapping

| Resource | KMS Key | Wire |
|----------|---------|------|
| RDS | `aws_kms_key.rds` | `kms_key_id = aws_kms_key.rds.arn` |
| Secrets Manager | `aws_kms_key.secrets` | `kms_key_id = aws_kms_key.secrets.arn` |
| S3 (sensitive buckets) | `aws_kms_key.s3` or shared | `server_side_encryption_configuration` with `kms_master_key_id` |
| CloudTrail S3 | `aws_kms_key.cloudtrail` or shared | `kms_key_id` in `aws_cloudtrail` |
| EKS secrets encryption | `aws_kms_key.eks` | `encryption_config` in `aws_eks_cluster` |
| DynamoDB | Optional | `server_side_encryption` with `kms_key_arn` |

---

## Key Requirements

- **`enable_key_rotation = true`** — Always enable for customer-managed keys.
- **`deletion_window_in_days = 7`** — Safe deletion window.
- **Key policy** — Root account full access; service principal (rds, secretsmanager) least privilege via `kms:ViaService` condition.

---

## Example (RDS + Secrets Manager)

```hcl
# kms.tf — Create when scaffolding RDS or Secrets Manager
resource "aws_kms_key" "rds" {
  description             = "${var.project} RDS encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Root"
        Effect = "Allow"
        Principal = { AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root" }
        Action  = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "RDS"
        Effect = "Allow"
        Principal = { Service = "rds.amazonaws.com" }
        Action  = ["kms:Decrypt", "kms:GenerateDataKey"]
        Resource = "*"
        Condition = { StringEquals = { "kms:ViaService" = "rds.${var.aws_region}.amazonaws.com" } }
      }
    ]
  })
}

resource "aws_kms_alias" "rds" {
  name          = "alias/${var.project}-${var.environment}-rds"
  target_key_id = aws_kms_key.rds.key_id
}
```

---

## When to Create Keys

| You scaffold | Create |
|--------------|--------|
| RDS | `aws_kms_key.rds` |
| Secrets Manager | `aws_kms_key.secrets` |
| S3 (assets, CloudTrail, state) | `aws_kms_key.s3` or per-bucket |
| CloudTrail | KMS for trail encryption (or S3 key) |
| EKS | Optional `aws_kms_key.eks` for secrets envelope |

---

## See Also

- `docs/terraform-apply-order.md` — KMS before RDS/Secrets Manager
- `docs/terraform-production-guardrails.md` — RDS storage_encrypted
- `docs/iam-least-privilege.md` — KMS key policy scoping
