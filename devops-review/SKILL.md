---
name: devops-review
description: Reviews CI/CD pipelines, GitOps configs, deployment safety, and observability. Covers promotion flow, approval gates, logging, metrics, tracing, runbooks. Use when assessing CI/CD, GitOps, ArgoCD, or deployment maturity.
risk_tier: 1
---

# DevOps Review

Specialist skill for CI/CD, GitOps, and operational maturity assessment.

## When to Use

- User asks for DevOps review, CI/CD assessment, or deployment safety check
- User mentions GitLab, GitHub Actions, ArgoCD, GitOps, promotion flow
- Focused DevOps evaluation (invoked by orchestrator or standalone)

## Evaluation Domains

### CI/CD Pipeline

- Pipeline structure (dev → stage → prod)
- Approval gates, manual vs automated
- Deployment frequency, lead time
- Failed job handling, rollback capability

### GitOps

- ArgoCD / Flux presence
- Sync status, drift detection
- Promotion flow (environments)

### Observability

- Logging (structured, centralized)
- Metrics (CloudWatch, Prometheus)
- Tracing (X-Ray, OpenTelemetry)
- Alerting (thresholds, routing)

### Operational Readiness

- Runbooks, incident response
- Tagging, cost allocation
- Change management

## Output Format

1. DevOps maturity score (0–10)
2. Top DevOps findings
3. CI/CD pipeline assessment
4. GitOps assessment (if present)
5. Observability gaps
6. Recommendations

## Evidence Labels

Observed / Inferred / Missing Evidence

## Additional Resources

- [reference.md](reference.md)
- [sample-output-report.md](sample-output-report.md)
- [prompt-template.md](prompt-template.md)
