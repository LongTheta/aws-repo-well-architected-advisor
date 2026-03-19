---
name: observability-review
description: Analyzes repositories and infrastructure for observability strategy. Covers SRE Golden Signals (latency, traffic, errors, saturation), DORA metrics, GitOps telemetry, Grafana dashboards. Use when assessing observability maturity, designing dashboards, or identifying telemetry gaps.
risk_tier: 1
---

# Observability Review

Evaluates and recommends observability across SRE Golden Signals, DORA metrics, and GitOps telemetry.

## Purpose

Assess observability maturity: metrics, logs, traces, dashboards, alerting. Contribute to Observability category scoring. Identify missing instrumentation.

## Triggers

- User asks for observability assessment, dashboard design, or telemetry gaps
- File patterns: `grafana/**`, `prometheus/**`, `otel/**`, `cloudwatch/**`
- Kubernetes/GitOps present

## Inputs

- Artifact inventory
- Inferred architecture
- Observability configs (Grafana, Prometheus, CloudWatch)

## Review Questions

- Are Golden Signals covered? (latency, traffic, errors, saturation)
- Are DORA metrics calculable? (deployment frequency, lead time, MTTR, change failure rate)
- Is GitOps telemetry present? (ArgoCD sync, drift)
- Are dashboards defined? Alert thresholds?
- Is logging structured? Correlation IDs? Distributed tracing?

## Evidence to Look For

| Domain | Evidence |
|--------|----------|
| CI/CD observability | Deployment frequency, lead time, failed jobs |
| GitOps signals | ArgoCD sync status, drift detection |
| Infrastructure | CPU, memory, autoscaling, pod health |
| Application | Latency, errors, throughput |
| Logging | Structured logs, correlation IDs, tracing |
| Alerting | Thresholds, routing (Slack, PagerDuty) |

## Scoring Contribution

- **Observability** (15% weight): Score 0–10 based on coverage, dashboards, alerting

## Expected Output

1. Observability maturity score (0–10)
2. Missing telemetry gaps
3. Recommended metrics per system
4. Grafana dashboard design (panels, queries, alerts)
5. Golden Signals mapping
6. DORA metrics calculation guidance
7. All findings tagged: evidence_type, confidence, severity
