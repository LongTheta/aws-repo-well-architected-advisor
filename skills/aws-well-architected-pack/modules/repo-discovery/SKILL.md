---
name: repo-discovery
description: Scans repository structure to inventory IaC (Terraform, CDK, CloudFormation), CI/CD (GitHub Actions, GitLab CI), Kubernetes manifests, Dockerfiles, and configs. Outputs artifact inventory for downstream architecture analysis. Use as first step in cloud architecture review.
risk_tier: 1
---

# Repo Discovery

Scans repositories to build an artifact inventory for cloud architecture analysis.

## Purpose

Build a deterministic inventory of artifacts that downstream modules use for inference and review. No analysis—only discovery and classification.

## Triggers

- First step in full architecture review (always runs first)
- User asks to inventory or discover repo structure
- File patterns: `*.tf`, `cdk.json`, `.github/workflows/`, `k8s/**`, `Dockerfile`, etc.

## Inputs

- Repository file tree
- Optional: user-specified paths to include/exclude

## Review Questions

- What IaC is present? (Terraform, CDK, CloudFormation)
- What CI/CD systems are used? (GitHub Actions, GitLab CI, Jenkins)
- Are Kubernetes manifests present? (raw, Helm, Kustomize)
- Are containers defined? (Dockerfile, docker-compose)
- What config files exist? (IAM, networking, app config)

## Evidence to Look For

| Category | Paths / Patterns | Artifacts |
|----------|-------------------|-----------|
| IaC | `*.tf`, `*.tf.json`, `cdk.json`, `*.ts` (CDK), `*.yaml` (CFN) | Terraform, OpenTofu, Terragrunt, CDK, CloudFormation |
| CI/CD | `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, `buildspec.yml` | GitHub Actions, GitLab CI, Jenkins, CodeBuild |
| Kubernetes | `k8s/**`, `**/deployment.yaml`, `Chart.yaml`, `kustomization.yaml` | Raw K8s, Helm, Kustomize |
| Containers | `Dockerfile`, `docker-compose*.yml` | Container build |
| Config | `.env*`, `*.config`, `application*.yml` | Environment, app config |
| IAM | `iam.tf`, `*policy*.json` | IAM roles, policies |
| Networking | `vpc.tf`, `*subnet*`, `*security_group*` | VPC, subnets, SGs |

## Scoring Contribution

None. Repo-discovery produces inventory only; no scores.

## Expected Output

```markdown
## Artifact Inventory

| Path | Type | Purpose |
|------|------|---------|
| infrastructure/terraform/main.tf | Terraform | Core IaC |
| .github/workflows/deploy.yml | GitHub Actions | CI/CD |
| k8s/deployment.yaml | Kubernetes | EKS workload |
```

Artifact types: Terraform, CloudFormation, CDK, Kubernetes, Helm, Kustomize, Dockerfile, GitHub Actions, GitLab CI, Jenkins, IAM policies, networking configs.
