# DORA Metrics Assessment

DevOps Research and Assessment (DORA) metrics for Operational Excellence. Include when assessing CI/CD and DevOps maturity.

---

## The Four Metrics

| Metric | Definition | Evidence Sources |
|--------|------------|------------------|
| **Deployment frequency** | How often code is deployed to production | CI/CD config (`.github/workflows`, `.gitlab-ci.yml`), ArgoCD sync, pipeline triggers |
| **Lead time for changes** | Time from commit to production deploy | Pipeline duration, approval gates, deploy job timestamps |
| **Change failure rate** | % of deployments causing incidents | Pipeline failures, rollbacks, failed jobs |
| **Mean time to restore (MTTR)** | Time from incident to resolution | Incident tracking, alert resolution; often not in repo |

---

## Inferrability from Repo

| Metric | Inferrable from repo? | How |
|--------|------------------------|-----|
| Deployment frequency | **Partially** | Pipeline config shows triggers (push, schedule); cannot infer actual deploy count without runtime data |
| Lead time | **Partially** | Pipeline stages, approval gates, job dependencies; actual duration needs Prometheus/GitLab API |
| Change failure rate | **No** | Requires pipeline success/failure history |
| MTTR | **No** | Requires incident/alert system integration |

**Output:** State `inferrable`, `partially_inferrable`, or `not_inferrable` per metric. Recommend instrumentation (Prometheus, GitLab exporter, ArgoCD metrics) when not inferrable.

---

## Evidence to Look For

- **CI/CD presence:** GitHub Actions, GitLab CI, Jenkins, Argo CD
- **Deploy automation:** Automated deploy on merge; no manual steps
- **Pipeline stages:** Build → Test → Deploy; approval gates
- **Observability:** Prometheus, Grafana, pipeline metrics
- **GitOps:** Argo CD, Flux; declarative deploy from Git

---

## Output Format (dora_assessment)

```json
"dora_assessment": {
  "deployment_frequency": { "status": "partially_inferrable", "evidence": ".github/workflows/deploy.yml triggers on push to main", "recommendation": "Add Prometheus pipeline metrics for actual count" },
  "lead_time": { "status": "partially_inferrable", "evidence": "Pipeline has 4 stages; no approval gates", "recommendation": "Track commit-to-deploy via GitLab API or Prometheus" },
  "change_failure_rate": { "status": "not_inferrable", "evidence": null, "recommendation": "Track pipeline failures; integrate with incident system" },
  "mttr": { "status": "not_inferrable", "evidence": null, "recommendation": "Integrate PagerDuty/Opsgenie for alert-to-resolution tracking" }
}
```

---

## See Also

- `observability-grafana-advisor/` — DORA metrics, Grafana dashboards
- `devops-review/SKILL.md` — Deployment frequency, lead time
- `cloud-architecture-ai-auditor/scoring-schema.yaml` — dora_metrics in observability
