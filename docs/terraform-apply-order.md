# Terraform Apply Order (Enforced)

**When generating Terraform** (scaffold, incremental-fix, patches), agents MUST follow these rules to avoid apply errors.

---

## Required Rules

### 1. CloudTrail → S3 Bucket Policy

`aws_cloudtrail` validates the S3 bucket policy before creating the trail. If the policy is not applied first, CloudTrail fails with `InsufficientS3BucketPolicyException`.

**MUST:** Add explicit `depends_on` on `aws_cloudtrail`:

```hcl
resource "aws_cloudtrail" "main" {
  # ...
  s3_bucket_name = aws_s3_bucket.cloudtrail[0].id

  depends_on = [
    aws_s3_bucket.cloudtrail,
    aws_s3_bucket_policy.cloudtrail,
    aws_s3_bucket_public_access_block.cloudtrail,
  ]
}
```

### 2. VPC Interface Endpoints → Security Group

Interface endpoints (ECR, Logs, etc.) require a security group. Define the security group before the endpoints that reference it.

**MUST:** Define `aws_security_group` for VPC endpoints before `aws_vpc_endpoint` resources that use it. Terraform infers the dependency from `security_group_ids`, but ordering improves clarity and avoids edge cases.

### 3. S3 Bucket Config Order

For S3 buckets with encryption, lifecycle, and public access block:

- Bucket → encryption config, lifecycle, public access block → bucket policy

Terraform infers these from references. For CloudTrail specifically, the bucket policy MUST complete before the trail.

### 4. Backend Bootstrap (First-Time)

Before first `terraform init` with S3 backend:

1. Create S3 bucket for state (with encryption)
2. Create DynamoDB table for state locking
3. Run `terraform init -backend-config=backend.hcl`

Provide `bootstrap-backend.sh` or equivalent when scaffolding.

### 5. KMS → RDS / Secrets Manager

KMS keys must exist before RDS (if `kms_key_id` used) or Secrets Manager. Terraform infers from references.

### 6. Globally Unique Names (S3, CloudTrail)

S3 bucket names and CloudTrail bucket names are globally unique. Use `random_id` suffix:

```hcl
resource "random_id" "suffix" { byte_length = 4 }
resource "aws_s3_bucket" "cloudtrail" {
  bucket = "${var.project}-${var.environment}-cloudtrail-${random_id.suffix.hex}"
}
```

---

## Validation

Run `npm run validate:terraform` (or `node scripts/validate_terraform_apply_order.js <path>`) to check Terraform files for CloudTrail without `depends_on` on bucket policy.

---

## Phased Apply (Optional)

For first-time or large applies, use `terraform apply -target=...` in phases:

1. VPC, subnets, route tables
2. KMS, RDS, ECR, Secrets
3. EKS
4. CloudTrail, CloudWatch alarms
5. VPC endpoints

---

## See Also

- `docs/terraform-deployment-checklist.md` — Pre-deploy requirements, IAM, uniqueness
- `docs/terraform-production-guardrails.md` — Production safety
- `docs/runbook.md` — Deployment checks, pre-deploy
- `schemas/deployment-plan.schema.json` — Deployment phases
