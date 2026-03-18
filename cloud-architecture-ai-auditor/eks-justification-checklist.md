# EKS Justification Checklist

**Rule:** Do NOT recommend EKS unless clearly justified. Prefer Lambda or ECS Fargate for most workloads.

Use this checklist to determine when EKS is appropriate. If fewer than 2 items apply, recommend ECS or Lambda instead.

---

## When EKS May Be Justified

| Criterion | Question | If Yes |
|-----------|----------|--------|
| **K8s ecosystem** | Does the workload require Kubernetes APIs, operators, or ecosystem tools? | EKS viable |
| **Multi-cluster** | Is multi-cluster orchestration (e.g., GitOps across envs) a requirement? | EKS viable |
| **Portability** | Is workload portability across clouds (AWS, GKE, AKS) a hard requirement? | EKS viable |
| **Team expertise** | Does the team have dedicated K8s/platform expertise to operate clusters? | EKS viable |
| **Workload complexity** | Does the workload need service mesh, complex networking, or advanced scheduling? | EKS viable |
| **Scale** | Is traffic/scale high enough that EKS control plane cost is justified? | EKS viable |
| **Existing investment** | Is there existing Helm charts, K8s manifests, or operator-based tooling? | EKS viable |

---

## When to Prefer ECS or Lambda Instead

| Scenario | Prefer |
|----------|--------|
| Single app, small team | ECS Fargate or Lambda |
| Simple API or web app | Lambda + API Gateway or ECS |
| Event-driven, bursty | Lambda |
| No K8s expertise | ECS Fargate |
| Cost-sensitive | Lambda or ECS (no control plane) |
| Minimal orchestration needs | ECS |

---

## Output Format

When recommending EKS, include in the report:

1. **Justification** — Which criteria from the checklist apply
2. **Tradeoffs** — Higher cost, operational burden, control plane management
3. **Alternative** — What ECS or Lambda would look like and when to reconsider

---

## Reference

- `aws-architecture-decision-engine.md` — Compute selection logic
- `aws-decision-engine.md` — Anti-pattern: EKS for simple app
- `recommendation-guardrails.yaml` — Do-not-recommend list
