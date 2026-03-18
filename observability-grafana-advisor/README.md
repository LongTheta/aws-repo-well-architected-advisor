# Observability Grafana Advisor

An AI skill that analyzes repositories, CI/CD pipelines, and infrastructure configurations to design and recommend a complete observability strategy, including metrics, logs, traces, and Grafana dashboards.

## Overview

This skill evaluates and recommends observability across:

| Framework | Scope |
|-----------|-------|
| **SRE Golden Signals** | Latency, Traffic, Errors, Saturation |
| **DORA Metrics** | Deployment frequency, lead time, MTTR, change failure rate |
| **GitOps Telemetry** | ArgoCD sync status, drift, GitLab pipeline metrics |

## Evaluation Domains

1. **CI/CD Pipeline Observability** — Deployment frequency, lead time, failed jobs, approvals, artifact promotion
2. **ArgoCD / GitOps Signals** — Sync status, drift detection, manual syncs, deployment history
3. **Infrastructure Metrics** — CPU, memory, autoscaling, pod health, node pressure, load balancer
4. **Application Signals** — Latency, errors, throughput, dependency failures
5. **Logging & Traceability** — Structured logs, correlation IDs, distributed tracing, log aggregation
6. **Alerting & Incident Visibility** — Thresholds, routing (Slack, PagerDuty), noise vs signal

## Key Features

- **Observability maturity score** (0–10)
- **Missing telemetry gaps** — Prioritized with evidence tags
- **Recommended metrics** — GitLab, ArgoCD, Kubernetes, AWS
- **Grafana dashboard designs** — 4 dashboards with panel names, Prometheus queries, alert thresholds, visualization types
- **Golden Signals mapping** — Per system (CI/CD, GitOps, infra, app)
- **DORA metrics guidance** — Calculation and data sources
- **Prometheus metrics** — ArgoCD (`argocd_app_health_status`, etc.), K8s, GitLab exporter

## Output

1. Observability maturity score (0–10)
2. Missing telemetry gaps
3. Recommended metrics per system (GitLab, ArgoCD, Kubernetes, AWS)
4. Grafana dashboard design (4 dashboards)
5. Per-dashboard: panel names, Prometheus queries, alert thresholds, visualization type
6. Golden Signals mapping
7. DORA metrics calculation guidance

## Rules

- **Prioritize actionable dashboards over vanity metrics**
- **Focus on deployment visibility and failure detection**
- **Highlight missing instrumentation clearly**

## Files in This Skill

| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill instructions |
| `README.md` | This overview |
| `reference.md` | Prometheus metrics, ArgoCD/GitLab/K8s |
| `sample-output-report.md` | Full example with dashboard designs |
| `prompt-template.md` | Invocation template |

## Usage Example

```
Design an observability strategy for my platform. We use GitLab CI and ArgoCD.
Include Grafana dashboard designs for deployment pipeline health and GitOps.
Recommend Prometheus metrics and DORA metrics calculation.
```
