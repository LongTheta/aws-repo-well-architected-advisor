# Remediation Ordering Logic

How to order findings for remediation. Output must include `ordered_remediation_plan` and `ordering_reasoning` per `schemas/review-score.schema.json`.

---

## Ordering Rules (Priority Tiers)

Apply in order. Within each tier, sort by severity (CRITICAL > HIGH > MEDIUM > LOW), then by `remediation_plan.dependencies` (fix dependencies before dependents).

| Tier | Rule | Examples |
|------|------|----------|
| **1** | Deployment blockers first | `blocking_status: deployment_blocker` — e.g. missing subnets, broken VPC |
| **2** | Security issues | `blocking_status: security_blocker` OR (`blocking_status: improvement` AND `category: security`) |
| **3** | Reliability | `category: reliability` |
| **4** | Cost and optimization | `category: cost_optimization`, `operational_excellence`, `performance_efficiency`, `sustainability`, `observability`, `compliance_evidence_quality`, `other` |

---

## Within-Tier Ordering

1. **Severity** — CRITICAL before HIGH before MEDIUM before LOW
2. **Dependencies** — If finding A's `remediation_plan.dependencies` includes finding B, B must come before A
3. **Score impact** — If tied, prefer higher `expected_score_impact`

---

## Output Requirements

- **ordered_remediation_plan** — Array of all finding IDs in execution order
- **ordering_reasoning** — Human-readable explanation, e.g.:
  - "I1 first: deployment_blocker (VPC subnets); deployment fails without it. I2 second: security_blocker (IAM); blocks production. I3 third: improvement (cost tags); non-blocking."
  - Must cite which tier each finding falls into and any dependency overrides

---

## Example

Findings: I1 (deployment_blocker, reliability), I2 (security_blocker, security), I3 (improvement, cost_optimization)

**ordered_remediation_plan:** `["I1", "I2", "I3"]`

**ordering_reasoning:** "I1 (deployment_blocker) first — VPC has no subnets; deployment will fail. I2 (security_blocker) second — no IAM roles; blocks production readiness. I3 (improvement, cost) third — cost allocation tags; non-blocking optimization."
