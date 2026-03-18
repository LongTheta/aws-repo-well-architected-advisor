# DevOps Review — Reference

## Evidence Sources

| Resource | Paths | What to Check |
|----------|-------|---------------|
| GitHub Actions | `.github/workflows/` | Stages, envs, approvals |
| GitLab CI | `.gitlab-ci.yml` | Stages, manual gates |
| ArgoCD | `argocd/`, `*.yaml` | Application, sync policy |
| Flux | `flux/`, kustomization | Reconciliation |
| CloudWatch | IaC, app config | Log groups, alarms |
| Prometheus | `prometheus/`, configs | Scrape configs |
| Runbooks | `docs/`, `runbooks/` | Incident response |

## Key Checks

- Promotion flow (dev → stage → prod)
- Manual approval for prod
- Structured logging
- Alert routing
- Rollback capability
