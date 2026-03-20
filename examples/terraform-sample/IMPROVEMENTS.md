# Terraform Improvements — Why Each Change Is Better

## 1. `local.resource_names` Map

**Change:** Centralized resource names in `local.resource_names` instead of inline `${local.name_prefix}-*` strings.

**Why better:** Single place to change naming convention; no scattered string concatenation; easier to grep and refactor.

---

## 2. IAM Policy — Separate Sids for ListBucket vs GetObject

**Change:** Split S3 policy into two statements with explicit `Sid` values: `ListBucket` (bucket ARN) and `GetObject` (object ARN pattern).

**Why better:** Clearer least-privilege; each action scoped to minimum resource; easier to audit and explain in compliance reviews.

---

## 3. Variable-Driven Config

**Change:** Added `var.dynamodb_point_in_time_recovery`, `var.lambda_runtime`, `var.rds_engine_version`, `var.alarm_period_seconds`.

**Why better:** Explicit control per environment; no magic `var.environment == "prod"`; prod tfvars can set PITR=true without code changes.

---

## 4. KMS Policy — Clarified and Tightened

**Change:** Renamed service statement `Sid` to `ServiceAccess`; added `kms:DescribeKey` for service principal; added inline comment explaining root vs service; added tags to KMS keys.

**Why better:** DescribeKey helps services validate key; tags enable cost allocation and discovery; comment documents why root has `kms:*`.

---

## 5. Unified Alarms with Single `for_each`

**Change:** Merged `lambda_alarms` and `rds_alarms` into one `alarm_definitions` map; single `aws_cloudwatch_metric_alarm.alarms` resource with `for_each`.

**Why better:** One resource type; add alarms by extending the map; `var.alarm_period_seconds` drives period; less duplication.

---

## 6. `merge(var.tags, { Name = ... })` Throughout

**Change:** All resources use `tags = merge(local.common_tags, { Name = local.resource_names.* })` where `common_tags = merge(var.tags, { Environment, Project, CostCenter })`.

**Why better:** Caller can inject Team, CostCenter, etc.; Name tag explicit per resource; aligns with architect rules.

---

## 7. DynamoDB PITR — Explicit Variable

**Change:** Replaced `var.environment == "prod"` with `var.dynamodb_point_in_time_recovery`.

**Why better:** Configurable without changing code; staging can enable PITR for testing; avoids environment-name coupling.
