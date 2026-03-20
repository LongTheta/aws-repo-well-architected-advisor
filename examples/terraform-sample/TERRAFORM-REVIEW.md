# Terraform Sample — Senior Platform Engineer Review

## 1. Weaknesses

| Area | Issue |
|------|-------|
| **Tags** | Uses `local.common_tags` instead of `merge(var.tags, {...})` per architect rules |
| **Naming** | Inconsistent: `var.project_name` vs architect rule `var.project` |
| **S3** | No `aws_s3_bucket_public_access_block` — public access not explicitly blocked |
| **DynamoDB** | No `server_side_encryption`; no `point_in_time_recovery` |
| **RDS** | `skip_final_snapshot`, `backup_retention_period` hardcoded; should vary by environment |
| **KMS** | Duplicated key policy structure; could use `for_each` or shared pattern |
| **Observability** | Repeated alarm blocks; retention hardcoded; no `for_each` |
| **Variables** | No `var.tags`; no env-specific config (RDS class, retention, etc.) |
| **Security** | RDS SG has no ingress rules (incomplete); default VPC for prod is a guardrail violation |
| **Partial patterns** | ALB comment with no implementation; misleading |

---

## 2. Recommended Improvements

1. **Add `var.tags`** and merge with `Name` per resource
2. **Rename `project_name` → `project`** for consistency with architect rules
3. **Add `aws_s3_bucket_public_access_block`** — block all public access by default
4. **Parameterize** `skip_final_snapshot`, `backup_retention_period`, `log_retention_days`, `rds_instance_class`
5. **Add DynamoDB** `server_side_encryption` with KMS; `point_in_time_recovery` for prod
6. **Refactor KMS** with `for_each` over service keys to remove duplication
7. **Refactor alarms** with `for_each` over alarm definitions
8. **Remove** misleading ALB comment or add minimal stub
9. **Add `outputs.tf`** for deployability (endpoints, ARNs)
10. **Add `var.environment`-based defaults** for prod vs dev (e.g. `skip_final_snapshot = var.environment != "prod"`)

---

## 3. Fully Improved Terraform

See the refactored files:
- `variables.tf` — `var.project`, `var.tags`, RDS/observability params
- `main.tf` — merge tags, S3 public access block, DynamoDB encryption + PITR, parameterized RDS
- `kms.tf` — `for_each` over keys (rds, s3, dynamodb)
- `observability.tf` — `for_each` over alarm definitions
- `outputs.tf` — Lambda name, RDS endpoint, S3 bucket, DynamoDB table
- `terraform.tfvars.example` — env-specific example

---

## 4. Why the New Version Is Better

| Improvement | Benefit |
|-------------|---------|
| **`merge(var.tags, {...})`** | Caller can add Team, CostCenter, etc.; aligns with architect rules |
| **`var.project`** | Consistent with `docs/terraform-architect-rules.md` naming |
| **S3 public access block** | Explicit security default; blocks accidental public exposure |
| **Parameterized RDS** | `rds_skip_final_snapshot`, `rds_backup_retention_period` vary by env (prod: retain, snapshot) |
| **DynamoDB KMS + PITR** | Encryption explicit; point-in-time recovery for prod |
| **KMS `for_each`** | One policy pattern; add new keys by extending map |
| **Alarm `for_each`** | Add alarms by extending `lambda_alarms` / `rds_alarms`; no copy-paste |
| **`var.log_retention_days`** | Configurable retention; prod can use 30+ days |
| **`outputs.tf`** | Deployable; consumers get endpoints, bucket name for wiring |
| **Removed ALB comment** | No partial/misleading pattern; add ALB when actually needed |
