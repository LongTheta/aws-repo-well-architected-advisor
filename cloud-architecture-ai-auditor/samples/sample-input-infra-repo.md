# Sample Input — Infrastructure Repo

Example repository structure for an **infrastructure**-classified repo. Primary content: IaC (Terraform, CDK, CloudFormation).

---

## Repo: `platform-infrastructure`

**Classification:** infrastructure

---

## Structure

```
platform-infrastructure/
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── backend.tf
│   ├── vpc.tf
│   ├── ecs.tf
│   ├── rds.tf
│   ├── iam.tf
│   ├── s3.tf
│   └── security-groups.tf
├── environments/
│   ├── dev.tfvars
│   ├── stage.tfvars
│   └── prod.tfvars
├── .github/
│   └── workflows/
│       ├── plan.yml
│       └── apply.yml
└── README.md
```

---

## Key Artifacts

| Path | Type | Purpose |
|------|------|---------|
| `terraform/*.tf` | Terraform | VPC, ECS, RDS, IAM, S3 |
| `environments/*.tfvars` | Env config | Dev, stage, prod |
| `.github/workflows/` | CI/CD | Plan, apply |

---

## What's Present

- VPC with public/private subnets
- ECS Fargate cluster
- RDS PostgreSQL
- IAM roles and policies
- S3 buckets
- Security groups
- GitHub Actions for Terraform

---

## Expected Review Focus

- **security-evaluator** — IAM, networking, encryption, secrets
- **ai-devsecops-policy-enforcement** — Pipeline, policy
- **tool-evaluator** — Terraform vs CDK, service selection
- **finops-cost-optimizer** — NAT, instance sizing, storage
