# Cloud Architecture AI Auditor — Execution Order

Defines sequencing and tie-breaking rules for skill execution when multiple skills are triggered.

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

### 2. Priority Tiers (After Discovery)

Skills run in priority order. Within a tier, skills can run in parallel or in any order unless dependencies exist.

| Tier | Priority | Skills | When |
|------|----------|--------|------|
| **P1** | Highest | Secret exposure detection, public exposure detection | Run immediately after architecture-inference if content triggers match |
| **P2** | High | `nist-compliance-evaluator`, `aws-architecture-pattern-advisor`, `finops-cost-optimizer`, `devops-operability-review`, networking review, IAM review, resilience gap | Run when file triggers match |
| **P3** | Medium | `observability-grafana-advisor`, over-engineering detection, cost refinement, observability gap | Run when file triggers match |
| **P4** | Final | `well-architected-scoring-engine`, questionnaire generation, target-state recommendation | Always run last |

---

### 3. Tie-Breaking Rules

When multiple skills are triggered:

1. **Security over cost** — If both P1 (security) and P2 (cost) apply, run P1 first
2. **Deduplication** — If multiple skills report the same issue, merge into one finding with: combined evidence, strongest severity, cross-framework mapping; attribute to primary skill
3. **Skill order within tier** — Use `skill-trigger-matrix.yaml` order: NIST before FinOps before observability when all apply
4. **Content triggers override** — If a content trigger (e.g. wildcard IAM) fires, ensure that skill runs even if file trigger didn't fire

---

### 4. Dependency Rules

| Skill | Depends On |
|-------|------------|
| `architecture-inference` | `repo-discovery` |
| All other skills | `architecture-inference` |
| `well-architected-scoring-engine` | All triggered skills |

---

### 5. Conditional Execution

**Do NOT run a skill if:**
- No file triggers match AND no content triggers match
- Skill is not in the triggered set for this repo

**Run a skill if:**
- Any file trigger matches OR any content trigger matches
- Skill is in `always_on.last` (well-architected-scoring-engine)

---

### 6. Fallback When No Triggers Match

If repo discovery finds nothing (empty repo, minimal files):

1. Still run `repo-discovery` → `architecture-inference` → `well-architected-scoring-engine`
2. Report: "Minimal artifacts detected. Recommend adding IaC, CI/CD, or config for full analysis."
3. Produce baseline architecture from assumptions
4. Present 6 refinement questions

---

### 7. Summary Flow

```
repo-discovery
    ↓
architecture-inference
    ↓
[Content triggers: P1 security checks]  ← Run immediately if patterns match
    ↓
[File triggers: resolve skills for P2, P3]
    ↓
[Run P2 skills]
    ↓
[Run P3 skills]
    ↓
well-architected-scoring-engine (aggregate, score, report)
    ↓
[If context unknown: present 6 questions]
```

---

## References

- `workload-sizing-rules.yaml` — Workload mode detection
- `ROUTING_RULES.md` — Full routing logic
- `skill-trigger-matrix.yaml` — File/content patterns and priority order
