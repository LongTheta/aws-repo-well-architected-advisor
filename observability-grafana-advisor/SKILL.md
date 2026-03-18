---
name: observability-grafana-advisor
description: Analyzes repos, CI/CD pipelines, and infrastructure configs to design a complete observability strategy with metrics, logs, traces, and Grafana dashboards. Covers SRE Golden Signals, DORA metrics, GitOps telemetry (ArgoCD, GitLab). Use when designing observability, Grafana dashboards, deployment visibility, or SRE metrics.
risk_tier: 1
---

# Observability Grafana Advisor

Analyzes repositories, CI/CD pipelines, and infrastructure configurations to design and recommend a complete observability strategy, including metrics, logs, traces, and Grafana dashboards.

## When to Use

- User asks to design observability strategy, Grafana dashboards, or SRE metrics
- User mentions Golden Signals, DORA metrics, ArgoCD, GitLab pipelines
- User needs deployment visibility, failure detection, or incident alerting
- User wants Prometheus metrics and dashboard recommendations

## Frameworks

| Framework | Scope |
|-----------|-------|
| **SRE Golden Signals** | Latency, Traffic, Errors, Saturation |
| **DORA Metrics** | Deployment frequency, lead time, MTTR, change failure rate |
| **GitOps Telemetry** | ArgoCD sync status, drift, GitLab pipeline metrics |

## Evaluation Domains

### 1. CI/CD Pipeline Observability

- Deployment frequency (pipeline triggers)
- Lead time (commit → deploy)
- Failed job rate
- Manual vs automated approvals
- Artifact promotion tracking

### 2. ArgoCD / GitOps Signals

- Sync status (Healthy / Degraded)
- Drift detection
- Manual sync events
- Deployment history tracking

### 3. Infrastructure Metrics

- CPU / memory utilization
- Autoscaling signals
- Pod health (Kubernetes)
- Node pressure
- Load balancer metrics

### 4. Application Signals

- Request latency
- Error rates
- Throughput
- Dependency failures

### 5. Logging & Traceability

- Structured logging presence
- Correlation IDs
- Distributed tracing support
- Central log aggregation

### 6. Alerting & Incident Visibility

- Alert thresholds
- Alert routing (Slack, PagerDuty)
- Noise vs signal balance

## Review Modules (Run in Order)

1. **Repo Discovery** — CI/CD configs, ArgoCD manifests, K8s, logging/tracing configs
2. **CI/CD Observability Review** — Pipeline metrics, DORA signals
3. **GitOps Review** — ArgoCD metrics, drift, sync status
4. **Infrastructure Metrics Review** — K8s, AWS, autoscaling
5. **Application Signals Review** — Latency, errors, throughput
6. **Logging & Tracing Review** — Structured logs, correlation IDs, tracing
7. **Alerting Review** — Thresholds, routing, noise
8. **Gap Analysis & Dashboard Design** — Missing telemetry, Grafana recommendations

## Mandatory Rules

- **Prioritize actionable dashboards over vanity metrics**
- **Focus on deployment visibility and failure detection**
- **Highlight missing instrumentation clearly**

## Output Format

Produce the report in this order. See [sample-output-report.md](sample-output-report.md) for a full example.

```markdown
# Observability Strategy — [Repo Name]

## 1. Observability Maturity Score (0–10)
[Overall score with rationale]

## 2. Missing Telemetry Gaps
[Prioritized list of gaps; Observed / Inferred / Missing Evidence]

## 3. Recommended Metrics per System
### GitLab
### ArgoCD
### Kubernetes
### AWS Services

## 4. Grafana Dashboard Design
### Dashboard 1: Deployment Pipeline Health
### Dashboard 2: GitOps / ArgoCD Health
### Dashboard 3: Infrastructure Health
### Dashboard 4: Application Performance

[For each dashboard: panel names, Prometheus queries, alert thresholds, visualization type]

## 5. Golden Signals Mapping
[Latency, Traffic, Errors, Saturation per system]

## 6. DORA Metrics Calculation Guidance
[Deployment frequency, lead time, MTTR, change failure rate — how to compute]
```

## Additional Resources

- [reference.md](reference.md) — Prometheus metrics, ArgoCD/GitLab/K8s exporters
- [sample-output-report.md](sample-output-report.md) — Full example with dashboard designs
- [prompt-template.md](prompt-template.md) — Invocation template
