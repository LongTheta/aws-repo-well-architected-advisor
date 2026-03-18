---
name: devops-operability-review
description: Reviews CI/CD pipelines, GitOps configs, deployment safety, and operability. Covers promotion flow, approval gates, logging, metrics, tracing, runbooks. Aligns with CompTIA Cloud+ and AWS Operational Excellence. Use when assessing CI/CD, GitOps, or deployment maturity.
risk_tier: 1
---

# DevOps Operability Review

Reviews CI/CD, GitOps, and operational readiness for cloud architecture assessment.

## When to Use

- Part of full cloud architecture review
- User asks for DevOps, CI/CD, or operability assessment
- Focus on deployment safety and operational excellence

## Evaluation Domains

### CI/CD Pipeline

- Pipeline structure (dev → stage → prod)
- Approval gates, manual vs automated
- Deployment frequency, lead time (DORA)
- Failed job handling, rollback capability
- Artifact promotion tracking

### GitOps

- ArgoCD / Flux presence
- Sync status, drift detection
- Manual sync events
- Deployment history

### Observability

- Logging (structured, centralized)
- Metrics (CloudWatch, Prometheus)
- Tracing (X-Ray, OpenTelemetry)
- Alerting (thresholds, routing)

### Operational Readiness

- Runbooks, incident response
- Tagging, cost allocation
- Change management
- Troubleshooting visibility

## Output Format

1. DevOps maturity score (0–10)
2. CI/CD assessment
3. GitOps assessment (if present)
4. Observability gaps
5. Operational readiness gaps
6. Recommendations

## Evidence Labels

Observed / Inferred / Missing Evidence

## Alignment

- **AWS Operational Excellence** — Run and monitor, evolve and improve
- **CompTIA Cloud+** — CI/CD, monitoring, troubleshooting
