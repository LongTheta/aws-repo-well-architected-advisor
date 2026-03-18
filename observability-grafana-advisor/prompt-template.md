# Invocation Prompt Template

Use this template when requesting an observability strategy or Grafana dashboard design.

---

**Request**: Design an observability strategy for my repository.

**Repository path**: [e.g., `.` or `path/to/repo`]

**Focus areas** (optional): [e.g., CI/CD, GitOps, infrastructure, application, all]

**Context** (optional):
- CI/CD: [GitLab / GitHub Actions / Jenkins / other]
- GitOps: [ArgoCD / Flux / none]
- Kubernetes: [EKS / GKE / AKS / none]
- Application stack: [e.g., Node.js, Python, Java]
- Existing observability: [Prometheus, CloudWatch, Datadog, none]

**Output preference** (optional): [Full report / Dashboard designs only / Metrics recommendations only]

---

## Example Invocations

**Minimal**:
```
Design an observability strategy for my repo. Include Grafana dashboards.
```

**Focused**:
```
Analyze my repo and recommend Grafana dashboards for:
- ArgoCD / GitOps health
- CI/CD pipeline (GitLab) metrics
- DORA metrics
```

**Detailed**:
```
Design a complete observability strategy for my platform:
- Repo: ./
- We use GitLab CI, ArgoCD, EKS
- Include: Golden Signals, DORA metrics, Grafana dashboard designs
- Recommend Prometheus metrics for ArgoCD, GitLab, Kubernetes
- Focus on deployment visibility and failure detection
```
