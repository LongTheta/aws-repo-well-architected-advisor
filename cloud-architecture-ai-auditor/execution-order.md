# Cloud Architecture AI Auditor — Execution Order

Defines the strict sequence for skill execution. See `skill-trigger-matrix.yaml` for `execution_order`.

---

## Review Execution Order

| Step | Skill | Purpose |
|------|-------|---------|
| 1 | `repo-discovery` | Build artifact inventory |
| 2 | `architecture-inference` | Infer current-state from inventory |
| 3 | `security-review` | IAM, secrets, encryption |
| 4 | `networking-review` | VPC, subnets, security groups, NAT |
| 5 | `finops-cost-optimizer` | Cost optimization, savings, tagging |
| 6 | `observability-grafana-advisor` | CloudWatch, Grafana, Golden Signals |
| 7 | `devops-review` | CI/CD, GitOps |
| 8 | `nist-compliance-evaluator` | NIST, Zero Trust, CIS, FedRAMP |
| 9 | `aws-federal-grade-checklist` | **FINAL GATE** — production-readiness |
| 10 | `well-architected-scoring-engine` | Aggregate findings; produce report |

---

## Workload Mode (Determined After Discovery)

After `repo-discovery` and `architecture-inference`, determine workload mode per `workload-sizing-rules.yaml`:

| Mode | When | Scope |
|------|------|-------|
| **Lightweight** | Small, early-stage, limited infra | Abbreviated; discovery + inference + minimal scoring |
| **Standard** | IaC + CI/CD + partial networking/IAM | Conditional skills per file triggers |
| **Full** | IaC + CI/CD + networking + IAM + observability | All triggered skills; full depth |
| **Regulated** | Federal/compliance/security signals | Full + compliance stack + Zero Trust |

**Label every report** with the workload mode used.

---

## Sequencing Rules

### 1. Always First (Mandatory)

| Order | Skill | Purpose |
|-------|-------|---------|
| 1 | `repo-discovery` | Build artifact inventory |
| 2 | `architecture-inference` | Infer current-state from inventory |

**Rule:** These run before any other skill. No exceptions.

---

### 2. Specialist Reviews (Steps 3–8)

Run in strict order. Skills run only when file or content triggers match (see `skill-trigger-matrix.yaml`).

| Step | Skill |
|------|-------|
| 3 | `security-review` |
| 4 | `networking-review` |
| 5 | `finops-cost-optimizer` |
| 6 | `observability-grafana-advisor` |
| 7 | `devops-review` |
| 8 | `nist-compliance-evaluator` |

---

### 3. Final Gate (Step 9)

| Step | Skill | Purpose |
|------|-------|---------|
| 9 | `aws-federal-grade-checklist` | **FINAL GATE** — Critical → NOT READY; High → require remediation |

---

### 4. Report Synthesis (Step 10)

| Step | Skill | Purpose |
|------|-------|---------|
| 10 | `well-architected-scoring-engine` | Aggregate findings; produce final report |

---

### 5. Tie-Breaking Rules

When multiple skills are triggered:

1. **Security over cost** — Security findings take precedence
2. **Deduplication** — Merge duplicate findings: combined evidence, strongest severity, cross-framework mapping
3. **Content triggers override** — If a content trigger (e.g. wildcard IAM) fires, ensure that skill runs even if file trigger didn't fire

---

### 6. Dependency Rules

| Skill | Depends On |
|-------|------------|
| `architecture-inference` | `repo-discovery` |
| Steps 3–9 | `architecture-inference` |
| `well-architected-scoring-engine` | All triggered skills (steps 3–9) |

---

### 7. Conditional Execution

**Do NOT run a skill if:**
- No file triggers match AND no content triggers match
- Skill is not in the triggered set for this repo

**Run a skill if:**
- Any file trigger matches OR any content trigger matches
- Skill is in `always_on` (repo-discovery, architecture-inference, well-architected-scoring-engine)

---

### 8. Summary Flow

```
1. repo-discovery
2. architecture-inference
3. security-review
4. networking-review
5. finops-cost-optimizer
6. observability-grafana-advisor
7. devops-review
8. nist-compliance-evaluator
9. aws-federal-grade-checklist (FINAL GATE)
10. well-architected-scoring-engine
```

---

## References

- `skill-trigger-matrix.yaml` — `execution_order` and file/content triggers
- `workload-sizing-rules.yaml` — Workload mode detection
- `ROUTING_RULES.md` — Full routing logic
