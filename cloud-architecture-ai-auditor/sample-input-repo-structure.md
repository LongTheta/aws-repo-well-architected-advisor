# Sample Input Repo Structure

Expected repository layout for the Cloud Architecture AI Auditor.

## Expected Layout

```
my-aws-app/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Build, test, lint
│       ├── deploy-dev.yml      # Deploy to dev
│       ├── deploy-stage.yml    # Deploy to stage (manual approval)
│       └── deploy-prod.yml     # Deploy to prod (manual approval)
├── infrastructure/
│   ├── terraform/              # or cdk/, cloudformation/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   ├── vpc.tf
│   │   ├── ecs.tf             # or eks.tf, lambda.tf
│   │   ├── rds.tf
│   │   ├── iam.tf
│   │   └── backend.tf
│   └── environments/
│       ├── dev.tfvars
│       ├── stage.tfvars
│       └── prod.tfvars
├── k8s/                       # If using EKS
│   ├── base/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── ingress.yaml
│   ├── overlays/
│   │   ├── dev/
│   │   ├── stage/
│   │   └── prod/
│   └── argo-application.yaml
├── src/                       # Application code
├── Dockerfile
├── docker-compose.yml         # Optional
├── .env.example               # No secrets; template only
├── buildspec.yml              # If using CodeBuild
└── README.md
```

## Artifact Types

| Type | Paths | Purpose |
|------|-------|---------|
| Terraform | `*.tf`, `*.tf.json` | IaC |
| OpenTofu / Terragrunt | `*.tf` | IaC |
| CDK | `cdk.json`, `lib/*.ts` | IaC |
| CloudFormation | `*.yaml`, `*.json` | IaC |
| GitHub Actions | `.github/workflows/*.yml` | CI/CD |
| GitLab CI | `.gitlab-ci.yml` | CI/CD |
| Jenkins | `Jenkinsfile` | CI/CD |
| Kubernetes | `k8s/**`, `**/deployment.yaml` | EKS |
| Helm | `Chart.yaml`, `values*.yaml` | Helm |
| Kustomize | `kustomization.yaml` | Kustomize |
| Docker | `Dockerfile` | Container |

## Minimal Viable Repo

At least one of: IaC, CI/CD, or deployment config.

## What Improves Review Quality

- Multiple environments (dev/stage/prod)
- Separate networking (vpc.tf)
- Explicit IAM (iam.tf)
- Tagging in IaC
- Observability configs
