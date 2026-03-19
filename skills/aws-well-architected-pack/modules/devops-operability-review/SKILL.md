---
name: devops-operability-review
description: Reviews CI/CD pipelines, GitOps configs, deployment safety, and operability. Covers promotion flow, approval gates, logging, metrics, tracing, runbooks. Aligns with CompTIA Cloud+ and AWS Operational Excellence. Use when assessing CI/CD, GitOps, or deployment maturity.
risk_tier: 1
---

# DevOps Operability Review

Reviews CI/CD, GitOps, and operational readiness for cloud architecture assessment.

## Purpose

Evaluate CI/CD structure, GitOps maturity, observability foundations, and operational readiness. Contribute to Operational Excellence pillar scoring.

## Triggers

- User asks for DevOps, CI/CD, or operability assessment
- File patterns: `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, `argocd/**`
- Kubernetes/GitOps present

## Inputs

- Artifact inventory
- Inferred architecture
- CI/CD configs, GitOps manifests (ArgoCD, Flux)

## Review Questions

- Is there a promotion flow (dev → stage → prod)?
- Are approval gates present for production?
- Is GitOps used? (ArgoCD, Flux) Sync status, drift detection?
- Are runbooks and incident response documented?
- Is tagging and cost allocation in place?

## Evidence to Look For

| Domain | Evidence |
|--------|----------|
| CI/CD | Pipeline structure, approval gates, rollback capability |
| GitOps | ArgoCD/Flux, sync status, drift detection |
| Observability | Logging, metrics, tracing, alerting |
| Operational | Runbooks, change management, troubleshooting visibility |

## Scoring Contribution

- **Operational Excellence** (15% weight): Score 0–10 based on CI/CD maturity, GitOps, runbooks

## Expected Output

1. DevOps maturity score (0–10)
2. CI/CD assessment
3. GitOps assessment (if present)
4. Observability gaps
5. Operational readiness gaps
6. Recommendations
7. All findings tagged: evidence_type, confidence, severity
