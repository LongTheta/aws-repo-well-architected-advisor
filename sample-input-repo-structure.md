# Sample Input Repo Structure

A typical repository that the AWS Repo Well-Architected Advisor can review effectively.

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
│   └── ...
├── Dockerfile
├── docker-compose.yml         # Optional
├── .env.example               # No secrets; template only
├── buildspec.yml              # If using CodeBuild
└── README.md
```

## Artifact Types the Advisor Looks For

| Type | Path Patterns | Purpose |
|------|---------------|---------|
| Terraform | `*.tf`, `*.tf.json` | IaC for AWS resources |
| CDK | `cdk.json`, `*.ts` in cdk/ | IaC via CDK |
| CloudFormation | `*.yaml`, `*.json` (template) | IaC via CFN |
| GitHub Actions | `.github/workflows/*.yml` | CI/CD |
| GitLab CI | `.gitlab-ci.yml` | CI/CD |
| Jenkins | `Jenkinsfile` | CI/CD |
| CodePipeline | `codepipeline*.json`, `buildspec.yml` | AWS-native CI/CD |
| Kubernetes | `k8s/**/*.yaml`, `**/deployment.yaml` | EKS workloads |
| Helm | `**/Chart.yaml`, `**/values*.yaml` | Helm charts |
| Docker | `Dockerfile`, `docker-compose*.yml` | Container build |
| Env | `.env*` (caution: may contain secrets) | Environment config |

## Minimal Viable Repo

For a basic review, the advisor needs at least one of:

- **IaC**: Terraform, CDK, or CloudFormation files
- **CI/CD**: At least one pipeline config
- **Deployment**: K8s manifests, Dockerfile, or deployment scripts

## What Improves Review Quality

- **Multiple environments** (dev/stage/prod) — Enables promotion flow analysis
- **Separate networking** (e.g., `vpc.tf`) — Enables VPC/subnet review
- **Explicit IAM** (e.g., `iam.tf`) — Enables role and policy review
- **Tagging in IaC** — Enables cost allocation and governance review
- **Observability configs** — Enables logging/metrics/tracing review

## Repos with Limited Evidence

If the repo has only application code and no IaC:

- **Inference** will be weak; many findings will be **Missing Evidence**
- **Recommendation**: Add IaC or point the advisor to a separate infra repo
