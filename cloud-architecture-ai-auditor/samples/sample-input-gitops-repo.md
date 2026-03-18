# Sample Input — GitOps Repo

Example repository structure for a **GitOps**-classified repo. Primary content: Kubernetes manifests, Helm, ArgoCD, Kustomize.

---

## Repo: `app-manifests`

**Classification:** gitops

---

## Structure

```
app-manifests/
├── base/
│   ├── kustomization.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   └── hpa.yaml
├── overlays/
│   ├── dev/
│   │   ├── kustomization.yaml
│   │   └── patch.yaml
│   ├── stage/
│   │   ├── kustomization.yaml
│   │   └── patch.yaml
│   └── prod/
│       ├── kustomization.yaml
│       └── patch.yaml
├── argocd/
│   ├── application.yaml
│   ├── applicationset.yaml
│   └── project.yaml
├── helm/
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── deployment.yaml
│       └── service.yaml
└── README.md
```

---

## Key Artifacts

| Path | Type | Purpose |
|------|------|---------|
| `base/` | Kustomize base | Shared manifests |
| `overlays/` | Kustomize overlays | Env-specific |
| `argocd/` | ArgoCD | Application, AppSet, Project |
| `helm/` | Helm chart | Alternative packaging |

---

## What's Present

- Kustomize base and overlays
- ArgoCD Application and ApplicationSet
- Helm chart
- HPA (autoscaling)
- ConfigMap, Deployment, Service

---

## Expected Review Focus

- **zero-trust-gitops-enforcement** — Promotion controls, RBAC, sync policy
- **dod-zero-trust-architect** — Zero Trust alignment
- **security-evaluator** — Network policies, RBAC, secrets
- **ai-devsecops-policy-enforcement** — Supply chain, image policy
