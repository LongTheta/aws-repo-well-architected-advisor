# Cloud Architecture AI Auditor — Routing Rules

Human-readable orchestration rules for automatic skill selection based on repository contents, detected technologies, and risk patterns.

---

## Operating Modes

Select mode before routing. See `operating-modes.yaml` and `OPERATING_MODES.md`.

| Condition | Mode | Behavior |
|-----------|------|----------|
| Repo files present | **Repo-Driven** | Analyze existing code; audit report; remediation |
| Only requirements/questions | **Spec-Driven** | Design platform from scratch; blueprint; implementation plan |
| Both repo + requirements | **Repo-Driven first, then refine** | Analyze repo; refine using Spec-Driven inputs |

**Shared rules (both modes):** Cheapest safe baseline; enforce tagging; avoid over-engineering; prefer managed services; no EKS unless justified; cost vs reliability tradeoffs; upgrade path.

**Output consistency (both modes):** Executive summary, architecture, cost snapshot, security baseline, observability plan, risks, recommendations.

---

## Design Principles

- **Never run every skill blindly** — Select skills based on evidence
- **Escalate security-critical findings early**
- **Always start with cheapest safe baseline architecture**
- **Ask business-context questions only after baseline analysis**
- **Always produce a merged final report**
- **Merge duplicate findings** — When multiple skills report the same issue: combined evidence, strongest severity, cross-framework mapping
- **Tag all findings** as Observed / Inferred / Missing Evidence / Contradictory Evidence

---

## Workload Sizing (Mode Selection)

Determine workload mode from repo discovery. **Label every report** with the mode used.

| Mode | When | What Runs |
|------|------|-----------|
| **Lightweight** | Repo is small, early-stage, or has limited infrastructure evidence | repo-discovery → architecture-inference → abbreviated scoring; skip deep NIST, FinOps, observability |
| **Standard** | Production IaC + CI/CD + partial networking/IAM | File-based triggers; conditional skills |
| **Full** | Production IaC + CI/CD + networking + IAM + observability | All triggered skills; full depth |
| **Regulated** | Federal/compliance/security signals (FedRAMP, HIPAA, PCI, Zero Trust, audit) | Full review + full compliance stack + Zero Trust stack |

**Evaluation order:** Regulated → Full → Standard → Lightweight (first match wins)

See `workload-sizing-rules.yaml` for signal detection.

---

## Always-On Flow

These run first or last in every review:

| Order | Skill | Purpose |
|-------|-------|---------|
| **First** | `repo-discovery` | Inventory IaC, CI/CD, K8s, configs |
| **Second** | `architecture-inference` | Infer current-state from artifacts |
| **Last** | `well-architected-scoring-engine` | Aggregate, score, synthesize final report |

---

## File-Based Triggers

### IaC (Terraform, Terragrunt, CDK, CloudFormation)

**If repo contains:** `*.tf`, `*.tf.json`, `terragrunt.hcl`, `cdk.json`, CloudFormation `*.yaml`/`*.json`

**Run:**
- `aws-architecture-pattern-advisor`
- `finops-cost-optimizer`
- `nist-compliance-evaluator`

---

### Kubernetes (Helm, Kustomize)

**If repo contains:** `*.yaml` in k8s dirs, `Chart.yaml`, `kustomization.yaml`, `deployment.yaml`, `service.yaml`

**Run:**
- `observability-grafana-advisor`
- `nist-compliance-evaluator`
- `aws-architecture-pattern-advisor`
- Networking review logic

---

### CI/CD (GitLab CI, GitHub Actions, Jenkins)

**If repo contains:** `.gitlab-ci.yml`, `.github/workflows/*.yml`, `Jenkinsfile`, `buildspec.yml`

**Run:**
- `devops-operability-review`
- Supply chain checks
- `observability-grafana-advisor`

---

### Containers (Dockerfiles)

**If repo contains:** `Dockerfile`, `docker-compose*.yml`

**Run:**
- `nist-compliance-evaluator`
- Supply chain checks
- Compute/runtime fit review

---

### IAM / Identity

**If repo contains:** IAM policies, trust policies, role definitions, `iam.tf`, `*policy*.json`

**Run:**
- `nist-compliance-evaluator`
- IAM/security review logic

---

### Observability Config

**If repo contains:** Prometheus, Grafana, CloudWatch, OpenTelemetry, logging config

**Run:**
- `observability-grafana-advisor`

---

## Pattern-Based Triggers (Risk Signals)

| Pattern | Trigger | Priority |
|---------|---------|----------|
| IAM policy with wildcard actions/resources | High-priority IAM review | P1 |
| Security groups / network rules expose 0.0.0.0/0 | High-priority network exposure review | P1 |
| Hardcoded secrets or suspicious credentials | High-priority secret handling review | P1 |
| EKS detected for small/simple application | Over-engineering review | P3 |
| NAT Gateway usage inferred | Cost optimization review (endpoints, data transfer) | P2 |
| No logging/monitoring signals | Observability gap analysis | P3 |
| No backup/DR evidence | Resilience gap analysis | P2 |

---

## Context-Question Triggers

**When to ask:** Only after baseline analysis is generated.

| Unknown Context | Question to Ask |
|-----------------|-----------------|
| Traffic pattern | Traffic question |
| Availability target | Availability question |
| Data criticality | Data criticality question |
| Team size / platform maturity | Team maturity question |
| Cost priority | Cost priority question |

See `question-trigger-rules.yaml` for detailed conditions.

---

## Priority Model

| Priority | Skills / Actions |
|----------|------------------|
| **P1** | repo-discovery, architecture-inference, secret exposure detection, public exposure detection |
| **P2** | NIST/security review, networking review, cost review, DevOps/release review |
| **P3** | Observability review, over-engineering detection, cost refinement suggestions |
| **P4** | Final report synthesis, questionnaire generation, target-state recommendation |

---

## Fallback Rules (Missing Business Context)

When business context is unknown or incomplete:

1. **Proceed with baseline** — Do not block; use cost-conscious defaults
2. **Defaults:** Low-moderate traffic, best-effort availability, non-critical data, basic compliance, small team, aggressive savings
3. **Generate baseline first** — Then present 6 refinement questions
4. **Label baseline** — "Cost-optimized baseline based on minimal assumptions"
5. **Refine later** — When answers arrive, produce delta and updated recommendation

---

## References

- `workload-sizing-rules.yaml` — Workload mode detection and scope
- `skill-trigger-matrix.yaml` — File/content patterns → skills
- `execution-order.md` — Sequencing and tie-breaking
- `question-trigger-rules.yaml` — When to ask refinement questions
- `orchestrator-prompt.md` — Reusable coordination prompt
