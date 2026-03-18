# Security Review — Reference

## Evidence Sources

| Resource | Terraform | What to Check |
|----------|-----------|---------------|
| IAM roles | `aws_iam_role` | assume_role_policy, inline policies |
| IAM policies | `aws_iam_role_policy`, `aws_iam_policy` | `*` in actions/resources |
| Secrets | `aws_secretsmanager`, SSM refs | Rotation, exposure |
| KMS | `aws_kms_key` | Key usage, alias |
| Encryption | S3, RDS, EBS configs | Default vs CMK |
| TLS | ALB/NLB listeners | TLS version, certs |
| K8s RBAC | Role, RoleBinding | Least privilege |
| CloudTrail | `aws_cloudtrail` | Enabled, log retention |

## Severity

| Level | Example |
|-------|---------|
| Critical | Plaintext secrets, no encryption |
| High | Broad IAM (`s3:*`), no rotation |
| Medium | Default encryption only |
| Low | Suboptimal key config |
