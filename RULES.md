# AWS Repo Well-Architected Advisor — Rules

Deterministic, rule-driven skill routing and enforcement. No agent dependency.

**Scope:** AWS only. See `AWS-SCOPE.md`.

---

## Rules

### Review Philosophy

- Be evidence-based
- Prefer the cheapest safe architecture
- Prefer managed AWS services when practical
- Avoid over-engineering
- Do not recommend EKS unless clearly justified
- Security takes precedence over cost savings

### Execution Rules

- Start with repo classification
- Select review mode based on repo type and signals
- Run skills in defined execution order (see `review-order.md`)
- Merge duplicate findings before final output
- Use the federal-grade checklist as the final gate for deep-review and regulated-review

### Evidence Rules

All findings must be labeled as:

- **observed** — Direct evidence in repo
- **inferred** — Derived from patterns
- **missing** — No evidence; cannot assume compliance
- **contradictory** — Conflicting signals

Do not assume controls exist without evidence.

### Gating Rules

- If `aws-federal-grade-checklist` returns any critical findings:
  - verdict = **NOT READY**
- If it returns any high findings:
  - verdict = **CONDITIONAL**
- Missing required governance tags in production-oriented workloads:
  - governance failure
- Missing evidence in regulated-review:
  - treated as risk, not compliance

### Required Tags

All recommended AWS resources must include:

- Project
- Environment
- Owner
- CostCenter
- ManagedBy
- Purpose
- DataClassification
- Lifecycle

---

## References

| File | Purpose |
|------|---------|
| `skill-trigger-matrix.yaml` | File patterns, content patterns, user intents → skills |
| `review-order.md` | Execution flow (phases 1–5) |
| `review-mode-definitions.md` | quick-scan, standard, deep-review, regulated-review |
| `repo-classification.md` | application, infrastructure, platform, GitOps, mixed |
| `final-verdict-logic.md` | READY, CONDITIONAL, NOT READY |
| `.cursorrules` | Condensed routing for Cursor |
