# Terraform tfvars Templates

When generating Terraform configuration, **always** create environment-specific tfvars templates for:

- `dev.tfvars.example`
- `stage.tfvars.example`
- `prod.tfvars.example`

These files must be **template-style** and must **NOT** guess customer-specific values.

---

## variables.tf — No Hardcoded Defaults for Customer Values

**Do NOT** use `default` in `variables.tf` for customer-specific inputs. Require them via tfvars.

**The exact variables depend on the scaffolded architecture.** For each app:

- **Core** (always): project, environment, aws_region
- **Ownership** (always): owner, cost_center, data_classification
- **Compute** (per architecture): EKS → eks_node_instance_types, eks_desired_size, etc.; ECS → ecs_cluster_name, etc.; Lambda → lambda_runtime, etc.
- **Data** (per architecture): RDS → rds_instance_class, rds_db_name, etc.; DynamoDB → dynamodb_*; S3 → bucket config
- **Network** (when VPC): vpc_cidr, vpc_az_count, nat_gateway_count
- **Secrets** (when used): db_password, secrets_workload_placeholders
- **Other** (when scaffolded): ECR, CloudTrail, observability, etc.

**Include** every customer-specific variable in the tfvars templates with placeholders. No defaults for those.

**Use defaults only** for feature flags and internal settings (e.g. `enable_cloudtrail = false`, `enable_observability_alarms = false`).

---

## Rules

1. **Use placeholders** like:
   - `"ADD_VALUE_HERE"`
   - `"REPLACE_WITH_SECURE_PASSWORD"`

2. **Do NOT hardcode** real customer values unless explicitly provided.

3. **For secrets:**
   - Keep `db_password` as: `db_password = "REPLACE_WITH_SECURE_PASSWORD"`
   - Add a comment that this should come from Vault or `TF_VAR_db_password`
   - Keep `secrets_workload_placeholders` with obvious placeholder values

4. **Section order** (include in this order; adapt to scaffolded architecture):

   ### Core
   - project, environment, aws_region, vpc_cidr (when VPC)

   ### Ownership / governance
   - owner, cost_center, data_classification

   ### Compute
   - Variables for the selected compute (EKS, ECS, Lambda, EC2) — e.g. instance types, scaling, runtime

   ### Data
   - Variables for the selected data store (RDS, DynamoDB, S3) — e.g. instance class, DB name, retention

   ### Network
   - vpc_az_count, nat_gateway_count (when VPC)

   ### Required
   - db_password (when RDS), other secrets

   ### ECR / CloudTrail / Observability
   - Include only when scaffolded

   ### Secrets
   - secrets_workload_placeholders (when Secrets Manager)

   ### Architecture (when scaffold supports workload modes)
   - compute_mode, database_mode

   ### Tags
   - tags map with placeholders

5. **Output** must look like a clean template a customer can fill in immediately.

6. **Environment name** directly in each file:
   - dev.tfvars.example → `environment = "dev"`
   - stage.tfvars.example → `environment = "stage"`
   - prod.tfvars.example → `environment = "prod"`

7. **Architecture defaults** (when applicable):
   - `compute_mode = "ecs"`
   - `database_mode = "rds"`

---

## Example

```hcl
# dev.tfvars — Copy to dev.tfvars and fill in. Never commit dev.tfvars.
# Use: terraform plan -var-file=dev.tfvars

# Core
project     = "ADD_VALUE_HERE"
environment = "dev"
aws_region  = "ADD_VALUE_HERE"

# Ownership / governance
owner               = "ADD_VALUE_HERE"
cost_center         = "ADD_VALUE_HERE"
data_classification = "ADD_VALUE_HERE"

# Required
# Prefer Vault or TF_VAR_db_password instead of committing real values
db_password = "REPLACE_WITH_SECURE_PASSWORD"

# Secrets (replace after initial apply)
secrets_workload_placeholders = {
  backend = { secret_key = "REPLACE_WITH_OPENSSL_RAND_HEX_32_OUTPUT" }
  security = { api_key = "REPLACE_WITH_STRONG_API_KEY" }
}

# Architecture (when scaffold supports it)
# compute_mode  = "ecs"
# database_mode = "rds"

# Tags
tags = {
  Environment        = "dev"
  Project            = "ADD_VALUE_HERE"
  DataClassification = "ADD_VALUE_HERE"
}
```
