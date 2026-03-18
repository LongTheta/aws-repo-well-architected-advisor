# Cloud Architecture Review — app-manifests (GitOps Repo)

**Review Date:** 2025-03-18

---

## 1. Executive Summary

The `app-manifests` repository contains Kubernetes manifests with Kustomize base and ArgoCD application. **Key gaps**: Image by tag not digest; no resource limits; no NetworkPolicies; ArgoCD sync policy not restricted. **Overall posture**: Moderate — GitOps structure present; add supply chain and Zero Trust controls.

**Top recommendations**: (1) Pin images by digest, (2) add resource limits, (3) restrict ArgoCD sync for prod.

---

## 2. Repo Classification

| Field | Value |
|-------|-------|
| **repo_type** | gitops |
| **confidence** | high |
| **reasoning** | ArgoCD, Kustomize, K8s manifests present; environment promotion configs |

---

## 3. Review Mode

| Field | Value |
|-------|-------|
| **review_mode** | standard |
| **reason_for_selection** | Default; GitOps present; no regulated signals |

---

## 4. Inferred Architecture

```
GitOps: ArgoCD + Kustomize
├── Base: deployment
├── ArgoCD: Application
└── Destination: default namespace
```

**Assumptions**: EKS cluster (Inferred). ArgoCD installed (Observed). Single app (Observed).

---

## 5. Scorecard

| Framework | Score | Key Gaps |
|-----------|-------|----------|
| Zero Trust GitOps | 5 | No sync policy restriction; image by tag |
| Security | 5 | No NetworkPolicies; no resource limits |
| Reliability | 5 | No HPA; no limits |
| Operations | 6 | Kustomize structure present |

---

## 6. Top Risks

| id | title | severity | confidence | evidence_type | affected_area |
|----|-------|----------|------------|---------------|---------------|
| G1 | Image by tag, not digest | medium | high | observed | security |
| G2 | No resource limits in deployment | high | high | observed | reliability |
| G3 | No NetworkPolicies | high | high | missing | security |
| G4 | ArgoCD sync policy not restricted | medium | medium | inferred | security |

---

## 7. Findings (Deduplicated)

### G1 — Image by tag
- **summary**: Deployment uses image:latest; supply chain risk.
- **evidence**: base/deployment.yaml
- **evidence_type**: observed
- **severity**: medium
- **confidence**: high
- **affected_area**: security
- **recommendation**: Pin image by digest (@sha256:...)
- **effort**: low
- **impact**: security
- **framework_mapping**: { aws_pillar: "security", devops_dora_finops: "supply_chain" }

### G2 — No resource limits
- **summary**: Deployment has no resource requests/limits; reliability risk.
- **evidence**: base/deployment.yaml
- **evidence_type**: observed
- **severity**: high
- **confidence**: high
- **affected_area**: reliability
- **recommendation**: Add resources.requests and resources.limits
- **effort**: low
- **impact**: reliability
- **framework_mapping**: { aws_pillar: "reliability", devops_dora_finops: "dora" }

### G3 — No NetworkPolicies
- **summary**: No NetworkPolicies; pod-to-pod unrestricted.
- **evidence**: N/A
- **evidence_type**: missing
- **severity**: high
- **confidence**: high
- **affected_area**: security
- **recommendation**: Add NetworkPolicy for namespace segmentation
- **effort**: medium
- **impact**: security
- **framework_mapping**: { aws_pillar: "security", nist_control: "SC-7" }

### G4 — ArgoCD sync not restricted
- **summary**: Application may allow auto-sync to prod.
- **evidence**: argocd/application.yaml
- **evidence_type**: inferred
- **severity**: medium
- **confidence**: medium
- **affected_area**: security
- **recommendation**: Set syncPolicy.automated: false for prod; require manual sync
- **effort**: low
- **impact**: security
- **framework_mapping**: { devops_dora_finops: "zero_trust_gitops" }

---

## 8. Cost Snapshot

**Estimated monthly**: Cannot determine from repo — cluster and workload size unknown.  
**Confidence**: low  
**Requires user input**: Cluster size, node count, workload scale.

---

## 9. Over-Engineering Check

No over-engineering. Single app, minimal structure. Guardrails: Do not add service mesh, excessive microservices, or complex observability without justification.

---

## 10. Remediation Backlog

| Issue | Evidence | Fix | Effort | Impact |
|-------|----------|-----|--------|--------|
| Image by tag | deployment.yaml | Pin by digest | low | security |
| No limits | deployment.yaml | Add resources | low | reliability |
| No NetworkPolicies | N/A | Add NetworkPolicy | medium | security |
| Sync policy | application.yaml | Restrict auto-sync | low | security |

---

## 11. Target-State Recommendation

- Pin images by digest
- Add resource requests/limits
- Add NetworkPolicies per namespace
- Restrict ArgoCD auto-sync for prod
- Consider PodSecurityStandard (restricted)
- Prefer single cluster; no service mesh for basic app
