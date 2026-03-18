# AWS Repo Scaffolder — Example Input

Input from architecture-decision-engine (Spec-Driven) or from a review report.

---

## Example: From Architecture Design

### Architecture Summary

| Aspect | Decision |
|--------|----------|
| Compute | Lambda |
| API | API Gateway HTTP API |
| Data | RDS Postgres (db.t3.micro) |
| Auth | Cognito User Pools |
| Storage | S3 |
| Networking | Default VPC for MVP |

### Recommended Services

- Lambda, API Gateway, Cognito, RDS Postgres, S3, SQS, Secrets Manager, CloudWatch

### Preferences

- IaC: Terraform
- CI/CD: GitHub Actions
- Project: task-app

---

## Example: From Review Findings

### Architecture (Inferred)

- ECS Fargate, ALB, RDS, VPC with public/private subnets

### Remediation Plan

| Issue | Fix |
|-------|-----|
| Wildcard IAM | Scoped permissions; least privilege |
| RDS publicly accessible | Private subnet; publicly_accessible = false |
| No required tags | Add Project, Environment, Owner, CostCenter, ManagedBy, Purpose, DataClassification, Lifecycle |
| No CloudTrail | Enable CloudTrail; S3 bucket for logs |
| Secrets in user_data | Use Secrets Manager; fetch at runtime |

### Preferences

- IaC: Terraform
- CI/CD: GitHub Actions
- Project: order-service
