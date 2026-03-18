---
name: repo-discovery
description: Scans repository structure to inventory IaC (Terraform, CDK, CloudFormation), CI/CD (GitHub Actions, GitLab CI), Kubernetes manifests, Dockerfiles, and configs. Outputs artifact inventory for downstream architecture analysis. Use as first step in cloud architecture review.
risk_tier: 1
---

# Repo Discovery

Scans repositories to build an artifact inventory for cloud architecture analysis.

## When to Use

- First step in full architecture review
- User asks to inventory or discover repo structure
- Need artifact list before inference or scoring

## Scan Targets

| Category | Paths / Patterns | Artifacts |
|----------|------------------|-----------|
| **IaC** | `*.tf`, `*.tf.json`, `cdk.json`, `*.ts` (CDK), `*.yaml` (CFN) | Terraform, OpenTofu, Terragrunt, CDK, CloudFormation |
| **CI/CD** | `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, `buildspec.yml` | GitHub Actions, GitLab CI, Jenkins, CodeBuild |
| **Kubernetes** | `k8s/**`, `**/deployment.yaml`, `Chart.yaml`, `kustomization.yaml` | Raw K8s, Helm, Kustomize |
| **Containers** | `Dockerfile`, `docker-compose*.yml` | Container build |
| **Config** | `.env*`, `*.config`, `application*.yml` | Environment, app config |
| **IAM** | `iam.tf`, `*policy*.json` | IAM roles, policies |
| **Networking** | `vpc.tf`, `*subnet*`, `*security_group*` | VPC, subnets, SGs |

## Output Format

```markdown
## Artifact Inventory

| Path | Type | Purpose |
|------|------|----------|
| infrastructure/terraform/main.tf | Terraform | Core IaC |
| .github/workflows/deploy.yml | GitHub Actions | CI/CD |
| k8s/deployment.yaml | Kubernetes | EKS workload |
| ... | ... | ... |
```

## Artifact Types

- Terraform / OpenTofu / Terragrunt
- CloudFormation / CDK
- Kubernetes / Helm / Kustomize
- Dockerfile
- GitHub Actions / GitLab CI / Jenkins
- Application configs
- IAM policies
- Networking configs
