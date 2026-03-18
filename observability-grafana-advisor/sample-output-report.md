# Sample Output Report

Example of a full observability strategy report with Grafana dashboard designs.

---

# Observability Strategy — my-app-platform

**Repository**: `my-app-platform`  
**Evaluation Date**: 2025-03-18  
**Advisor**: Observability Grafana Advisor

---

## 1. Observability Maturity Score (0–10)

**Score**: **5/10**

**Rationale**:
- CI/CD: Basic pipeline; no pipeline metrics exporter (Missing Evidence)
- GitOps: ArgoCD present; metrics endpoint not confirmed in repo
- Infrastructure: CloudWatch for ECS; K8s metrics partial
- Application: No structured latency/error metrics in app code (Inferred)
- Logging: CloudWatch logs; no correlation IDs (Inferred)
- Alerting: Basic CloudWatch alarms; no PagerDuty/Slack routing (Observed)

**Gaps**: Pipeline telemetry, DORA metrics, distributed tracing, correlation IDs.

---

## 2. Missing Telemetry Gaps

| Rank | Gap | System | Severity | Evidence |
|------|-----|--------|----------|----------|
| 1 | No pipeline metrics (deployment frequency, lead time) | GitLab CI | High | Missing Evidence |
| 2 | ArgoCD metrics not exposed to Prometheus | ArgoCD | High | Inferred |
| 3 | No correlation IDs in logs | Application | High | Missing Evidence |
| 4 | No distributed tracing (X-Ray/OpenTelemetry) | Application | Medium | Missing Evidence |
| 5 | DORA metrics not calculated | CI/CD | Medium | Missing Evidence |
| 6 | Alert routing to Slack/PagerDuty not configured | Alerting | Medium | Observed |
| 7 | No pod-level restart tracking | Kubernetes | Medium | Inferred |
| 8 | Change failure rate not tracked | CI/CD | Low | Missing Evidence |

---

## 3. Recommended Metrics per System

### GitLab

| Metric | Source | Purpose |
|--------|--------|---------|
| `gitlab_ci_pipeline_last_run_status` | gitlab-exporter | Pipeline health |
| `gitlab_ci_pipeline_duration_seconds` | gitlab-exporter | Lead time |
| `gitlab_ci_pipeline_run_count` | gitlab-exporter | Deployment frequency |
| `gitlab_ci_job_run_count` | gitlab-exporter | Job activity |
| `gitlab_ci_job_duration_seconds` | gitlab-exporter | Job performance |

**Setup**: Deploy [gitlab-exporter](https://github.com/mvisonneau/gitlab-exporter) or use GitLab API + custom exporter.

### ArgoCD

| Metric | Source | Purpose |
|--------|--------|---------|
| `argocd_app_health_status` | ArgoCD metrics | App health (Healthy/Degraded) |
| `argocd_app_sync_status` | ArgoCD metrics | Sync status (Synced/OutOfSync) |
| `argocd_app_sync_total` | ArgoCD metrics | Sync frequency |
| `argocd_app_reconcile_count` | ArgoCD metrics | Drift events |

**Setup**: Enable ArgoCD metrics; add Prometheus ServiceMonitor or scrape config.

### Kubernetes

| Metric | Source | Purpose |
|--------|--------|---------|
| `kube_pod_status_phase` | kube-state-metrics | Pod health |
| `kube_pod_container_status_restarts_total` | kube-state-metrics | Restarts |
| `kube_node_status_condition` | kube-state-metrics | Node pressure |
| `container_cpu_usage_seconds_total` | cAdvisor | CPU saturation |
| `container_memory_working_set_bytes` | cAdvisor | Memory saturation |
| `kube_deployment_status_replicas_available` | kube-state-metrics | Availability |

### AWS Services

| Metric | Source | Purpose |
|--------|--------|---------|
| `aws_elb_healthy_host_count` | CloudWatch Exporter | ALB target health |
| `aws_elb_request_count` | CloudWatch Exporter | Traffic |
| `aws_elb_latency` | CloudWatch Exporter | Latency |
| `aws_ecs_cpu_utilization` | CloudWatch | ECS CPU |
| `aws_ecs_memory_utilization` | CloudWatch | ECS memory |

---

## 4. Grafana Dashboard Design

### Dashboard 1: Deployment Pipeline Health

**Purpose**: DORA metrics, pipeline success/failure, lead time visibility.

| Panel Name | Metric / Query | Alert Threshold | Visualization |
|------------|----------------|-----------------|---------------|
| Deployments Today | `increase(gitlab_ci_pipeline_run_count{status="success"}[1d])` | — | Stat |
| Pipeline Success Rate (24h) | `sum(rate(gitlab_ci_pipeline_run_count{status="success"}[24h])) / sum(rate(gitlab_ci_pipeline_run_count[24h])) * 100` | < 95% | Gauge |
| Failed Pipelines (24h) | `increase(gitlab_ci_pipeline_run_count{status="failed"}[1d])` | > 2 | Stat |
| Lead Time (p50) | `histogram_quantile(0.5, gitlab_ci_pipeline_duration_seconds)` | > 15m | Graph |
| Lead Time (p95) | `histogram_quantile(0.95, gitlab_ci_pipeline_duration_seconds)` | > 30m | Graph |
| Pipeline Duration Trend | `gitlab_ci_pipeline_duration_seconds` | — | Time series |
| Jobs by Status (Table) | `gitlab_ci_job_run_count` by status | — | Table |

**Alerts**:
- Pipeline success rate < 95% (24h)
- Failed pipelines > 2 in 24h
- Lead time p95 > 30m

---

### Dashboard 2: GitOps / ArgoCD Health

**Purpose**: Sync status, drift detection, manual sync events.

| Panel Name | Metric / Query | Alert Threshold | Visualization |
|------------|----------------|-----------------|---------------|
| Healthy Apps | `count(argocd_app_health_status{health_status="Healthy"} == 1)` | — | Stat |
| Degraded Apps | `count(argocd_app_health_status{health_status="Degraded"} == 1)` | > 0 | Stat |
| Out-of-Sync Apps | `count(argocd_app_sync_status{sync_status="OutOfSync"} == 1)` | > 0 | Stat |
| App Health by Status | `argocd_app_health_status` by app | — | Table |
| Sync Status by App | `argocd_app_sync_status` by app | — | Table |
| Sync Events (24h) | `increase(argocd_app_sync_total[1d])` | — | Stat |
| Drift Events | `increase(argocd_app_reconcile_count[1h])` where sync_status=OutOfSync | — | Graph |
| Apps Health Trend | `argocd_app_health_status` over time | — | Time series |

**Alerts**:
- Any app Degraded
- Any app OutOfSync > 5m
- Sync failure rate > 10%

**Prometheus queries**:
```
# Degraded apps
argocd_app_health_status{health_status="Degraded"} == 1

# Out-of-sync
argocd_app_sync_status{sync_status="OutOfSync"} == 1
```

---

### Dashboard 3: Infrastructure Health

**Purpose**: CPU, memory, pod health, node pressure, autoscaling.

| Panel Name | Metric / Query | Alert Threshold | Visualization |
|------------|----------------|-----------------|---------------|
| Cluster CPU Utilization | `sum(rate(container_cpu_usage_seconds_total[5m])) / sum(kube_node_status_capacity_cpu_cores) * 100` | > 80% | Gauge |
| Cluster Memory Utilization | `sum(container_memory_working_set_bytes) / sum(kube_node_status_capacity_memory_bytes) * 100` | > 85% | Gauge |
| Pods Not Ready | `count(kube_pod_status_phase{phase!="Running"} == 1)` | > 0 | Stat |
| Container Restarts (24h) | `increase(kube_pod_container_status_restarts_total[1d])` by pod | > 5 | Table |
| Node Pressure (Memory) | `kube_node_status_condition{condition="MemoryPressure",status="true"}` | > 0 | Stat |
| Node Pressure (Disk) | `kube_node_status_condition{condition="DiskPressure",status="true"}` | > 0 | Stat |
| HPA Current vs Desired | `kube_hpa_status_current_replicas`, `kube_hpa_status_desired_replicas` | — | Graph |
| ALB Healthy Targets | `aws_elb_healthy_host_count` | < expected | Stat |
| ALB Request Count | `rate(aws_elb_request_count[5m])` | — | Graph |
| ALB Latency (p99) | `aws_elb_latency_p99` | > 1s | Graph |

**Alerts**:
- Cluster CPU > 80%
- Cluster memory > 85%
- Any pod not Running
- Any node MemoryPressure or DiskPressure
- ALB healthy hosts < 1

---

### Dashboard 4: Application Performance

**Purpose**: Latency, errors, throughput, dependency health (Golden Signals).

| Panel Name | Metric / Query | Alert Threshold | Visualization |
|------------|----------------|-----------------|---------------|
| Request Rate (RPS) | `sum(rate(http_requests_total[5m]))` | — | Graph |
| Error Rate (%) | `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100` | > 1% | Graph |
| Latency p50 | `histogram_quantile(0.5, rate(http_request_duration_seconds_bucket[5m]))` | — | Graph |
| Latency p95 | `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` | > 500ms | Graph |
| Latency p99 | `histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))` | > 1s | Graph |
| Latency Heatmap | `http_request_duration_seconds_bucket` | — | Heatmap |
| Dependency Errors | `sum(rate(http_client_requests_total{status=~"5.."}[5m]))` by dependency | > 0 | Graph |
| Active Connections | `http_connections_active` | — | Stat |
| Queue Depth | `queue_messages_total` or equivalent | > 1000 | Stat |

**Alerts**:
- Error rate > 1%
- Latency p99 > 1s
- Dependency error rate > 0.1%

**Note**: Requires application to expose Prometheus metrics (`http_requests_total`, `http_request_duration_seconds_bucket`). If missing, recommend instrumentation.

---

## 5. Golden Signals Mapping

| Signal | CI/CD Pipeline | GitOps (ArgoCD) | Infrastructure | Application |
|--------|----------------|-----------------|----------------|-------------|
| **Latency** | Pipeline duration, job duration | Sync duration | ALB latency, DB latency | Request p50/p95/p99 |
| **Traffic** | Pipeline runs, job runs | Sync events | Request count, connections | RPS, throughput |
| **Errors** | Failed jobs, failed pipelines | Sync failures, Degraded | Pod crashes, 5xx | Error rate, 4xx/5xx |
| **Saturation** | Queue depth, concurrent jobs | Pending syncs | CPU %, memory % | Queue depth, connection pool |

---

## 6. DORA Metrics Calculation Guidance

| Metric | Calculation | Data Source | Implementation |
|--------|-------------|-------------|----------------|
| **Deployment frequency** | Count of successful prod deploys per day | GitLab pipeline success (main/prod); ArgoCD sync success | `count(gitlab_ci_pipeline_run_count{ref="main",status="success"})` per day |
| **Lead time** | Time from commit to deploy | Git commit timestamp → pipeline end timestamp | GitLab API: `created_at` of commit vs `finished_at` of deploy job |
| **Change failure rate** | (Failed deploys + rollbacks) / Total deploys | Pipeline failures; ArgoCD rollbacks | `failed / (success + failed) * 100` |
| **MTTR** | Mean time from incident start to resolution | PagerDuty/incident system; or alert fired → alert resolved | Requires incident tracking integration |

**Recommended**:
1. Export GitLab pipeline events to Prometheus (gitlab-exporter or custom).
2. Tag ArgoCD sync metrics with `environment` (dev/stage/prod).
3. For MTTR: integrate PagerDuty or Opsgenie; use `alert_firing` → `alert_resolved` delta.

---

## 7. Alert Routing Recommendations

| Alert | Route To | Severity |
|-------|----------|----------|
| ArgoCD app Degraded | Slack #gitops; PagerDuty if prod | High |
| Pipeline failure rate > 10% | Slack #ci-cd | Medium |
| Cluster CPU > 90% | PagerDuty | Critical |
| Application error rate > 5% | PagerDuty | Critical |
| Latency p99 > 2s | Slack; PagerDuty if sustained | High |

**Noise reduction**: Use alert grouping, inhibition rules, and severity-based routing. Avoid alerting on single blips; use `for` clause (e.g., 5m) to reduce noise.

---

*End of sample report*
