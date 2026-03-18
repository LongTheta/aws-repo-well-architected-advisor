# Observability Grafana Advisor — Reference

## Prometheus Metrics by System

### ArgoCD Metrics

| Metric | Description | Use |
|--------|-------------|-----|
| `argocd_app_info` | App metadata | Filtering |
| `argocd_app_health_status` | Health: Healthy=1, Degraded=2, Progressing=3, Suspended=4, Missing=5, Unknown=6 | Sync health |
| `argocd_app_sync_status` | Sync: Synced=1, OutOfSync=2 | Drift detection |
| `argocd_app_sync_total` | Sync operations count | Deployment frequency |
| `argocd_app_k8s_request_total` | K8s API requests | Activity |
| `argocd_app_reconcile_count` | Reconcile count | Drift events |

**Queries**:
- Degraded apps: `argocd_app_health_status{health_status="Degraded"} == 1`
- Out-of-sync: `argocd_app_sync_status{sync_status="OutOfSync"} == 1`

### GitLab Exporter Metrics

| Metric | Description | Use |
|--------|-------------|-----|
| `gitlab_ci_pipeline_last_run_status` | 0=unknown, 1=success, 2=failed | Pipeline health |
| `gitlab_ci_pipeline_duration_seconds` | Pipeline duration | Lead time |
| `gitlab_ci_job_duration_seconds` | Job duration | Job performance |
| `gitlab_ci_pipeline_run_count` | Pipeline runs | Deployment frequency |
| `gitlab_ci_job_run_count` | Job runs | Job frequency |

**Note**: Requires [gitlab-exporter](https://github.com/mvisonneau/gitlab-exporter) or similar.

### Kubernetes Metrics (kube-state-metrics, node-exporter)

| Metric | Description | Use |
|--------|-------------|-----|
| `kube_pod_status_phase` | Pod phase (Pending, Running, Failed) | Pod health |
| `kube_pod_container_status_restarts_total` | Container restarts | Instability |
| `kube_node_status_condition` | Node conditions (Ready, MemoryPressure, DiskPressure) | Node pressure |
| `container_cpu_usage_seconds_total` | CPU usage | Saturation |
| `container_memory_working_set_bytes` | Memory usage | Saturation |
| `kube_deployment_status_replicas_available` | Available replicas | Availability |
| `kube_hpa_status_current_replicas` | HPA current replicas | Autoscaling |

### AWS Metrics (CloudWatch Exporter / native)

| Metric | Description | Use |
|--------|-------------|-----|
| `aws_elb_healthy_host_count` | Healthy targets | ALB/NLB health |
| `aws_elb_request_count` | Request count | Traffic |
| `aws_elb_latency` | Request latency | Latency |
| `aws_rds_cpu_utilization` | RDS CPU | Saturation |
| `aws_ec2_cpu_utilization` | EC2 CPU | Saturation |

## Golden Signals Mapping

| Signal | CI/CD | GitOps | Infrastructure | Application |
|--------|-------|--------|-----------------|-------------|
| **Latency** | Pipeline duration, job duration | Sync duration | Request latency, DB latency | Request latency, p99 |
| **Traffic** | Pipeline runs, job runs | Sync events | Request rate, connections | RPS, throughput |
| **Errors** | Failed jobs, failed pipelines | Sync failures, Degraded | 5xx, pod crashes | Error rate, 4xx/5xx |
| **Saturation** | Queue depth, concurrent jobs | Pending syncs | CPU, memory, disk | Queue depth, connection pool |

## DORA Metrics Calculation

| Metric | How to Compute | Data Source |
|--------|----------------|-------------|
| **Deployment frequency** | Deployments per day/week (to prod) | Pipeline success events, ArgoCD sync success |
| **Lead time** | Time from commit to production deploy | Git commit timestamp → deploy timestamp |
| **Change failure rate** | % of deployments causing incidents | Failed deploys / total deploys; or rollbacks |
| **MTTR** | Mean time to restore from incident | Incident start → resolution |

## Dashboard Panel Conventions

| Visualization | Use Case |
|----------------|----------|
| **Stat** | Single value (e.g., deployment count today) |
| **Gauge** | Bounded metric (e.g., health status 0–100) |
| **Graph** | Time series (latency, traffic, errors) |
| **Table** | Multi-dimensional (apps by status, jobs by result) |
| **Heatmap** | Distribution (latency percentiles) |

## Evidence Labels

| Label | Meaning |
|-------|---------|
| **Observed** | Instrumentation present in repo |
| **Inferred** | Likely present from patterns |
| **Missing Evidence** | Not found; recommend addition |
