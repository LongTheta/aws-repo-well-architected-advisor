# Sample Input — Infrastructure Repo

Example repository structure for an **infrastructure**-classified repo. Generic; no org-specific branding.

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

## Expected Review Focus

- **repo-discovery** — Inventory IaC, CI/CD
- **architecture-inference** — Map VPC, ECS, RDS, S3
- **security-review** — IAM, networking, encryption
- **networking-review** — VPC, subnets, security groups
- **finops-cost-review** — NAT, instance sizing, storage
- **devops-operability-review** — CI/CD pipeline
