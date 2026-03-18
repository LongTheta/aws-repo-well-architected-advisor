# Sample Assets

Minimal realistic structures and reports for the cloud architecture review system.

## Sample Repos (Minimal Structure)

| Repo | Classification | Contents |
|------|----------------|----------|
| `sample_app_repo/` | application | Python app, requirements.txt, Dockerfile, GitHub Actions |
| `sample_infra_repo/` | infrastructure | Terraform (VPC), GitHub Actions plan |
| `sample_gitops_repo/` | gitops | Kustomize base, ArgoCD application |

## Sample Reports (Shared Schema)

| Report | Repo | Conforms To |
|--------|------|-------------|
| `sample-report-app.md` | sample_app_repo | finding-schema.yaml, output-consistency-rules.yaml |
| `sample-report-infra.md` | sample_infra_repo | finding-schema.yaml, output-consistency-rules.yaml |
| `sample-report-gitops.md` | sample_gitops_repo | finding-schema.yaml, output-consistency-rules.yaml |

## Input Documentation

| File | Purpose |
|------|---------|
| `sample-input-app-repo.md` | Expected structure for application repos |
| `sample-input-infra-repo.md` | Expected structure for infrastructure repos |
| `sample-input-gitops-repo.md` | Expected structure for GitOps repos |
