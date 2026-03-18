# Sample Security Review Output

## Security Score: 5/10

## Top Findings

| Rank | Finding | Severity | Evidence |
|------|---------|----------|----------|
| 1 | ECS task role has `s3:*` | Critical | `iam.tf:42` |
| 2 | Secrets in Parameter Store; no rotation | High | `variables.tf` |
| 3 | No KMS CMK for RDS | Medium | `rds.tf` |
| 4 | CloudTrail not in IaC | Medium | Missing Evidence |

## IAM Findings

- Wildcard `s3:*` in ECS task role — restrict to bucket/prefix
- Trust policy allows ECS tasks (Observed)

## Secrets & Encryption

- TLS 1.2+ on ALB (Observed)
- RDS default encryption only (Observed)
- Secrets in SSM; rotation not configured (Inferred)

## Remediation

1. Restrict ECS IAM to least privilege
2. Migrate secrets to Secrets Manager with rotation
3. Enable KMS CMK for RDS
