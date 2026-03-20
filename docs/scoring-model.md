# Scoring Model

Default output model for /repo-assess, /gitops-audit, /federal-checklist, /verify.

## Categories and Weights

Use schema enum values (`cost_optimization`, not "Cost Awareness") in JSON. Display names may vary in reports.

| Category (schema key) | Weight | Module |
|----------------------|--------|--------|
| security | 20% | security-review |
| reliability | 15% | reliability-resilience-review |
| performance_efficiency | 10% | aws-architecture-pattern-review |
| cost_optimization | 15% | finops-cost-review |
| operational_excellence | 15% | devops-operability-review |
| observability | 15% | observability-review |
| compliance_evidence_quality | 10% | compliance-evidence-review |

## Per-Category Output

- **score** (0–10)
- **rationale**
- **evidence_found**
- **missing_evidence**
- **key_risks**
- **recommended_actions**

## Letter Grade

| Range | Grade |
|-------|-------|
| 9–10 | A |
| 8–8.9 | B+ |
| 7–7.9 | B |
| 5–6.9 | C |
| 3–4.9 | D |
| 0–2.9 | F |

## Production Readiness

| Condition | Verdict |
|-----------|---------|
| Any CRITICAL | NOT_READY |
| Any HIGH | CONDITIONAL |
| Missing tags in prod | CONDITIONAL |
| Missing evidence (critical control) | CONDITIONAL |
| All MEDIUM or lower, evidence adequate | READY |

## Minimum Production Baseline

Every review must include `production_baseline` per `docs/production-baseline.md`:

- **required_components** — List of required components for production readiness
- **missing_components** — Which are missing (with reason, finding_ids)
- **not_ready_reason** — **REQUIRED when NOT_READY.** Explicit statement; must not be implied.

## Confidence Level

- **Confirmed** — All critical findings have Observed evidence
- **Strongly Inferred** — Some Inferred; no critical gaps
- **Assumed** — Missing evidence; recommend validation

## Score Projection (Category Weights)

Score projections must be based on category weights, not arbitrary guesses.

**Formula:** `weighted_overall_score = sum(category_score × weight) / sum(weights)` for all scored categories.

**Per-finding expected_score_impact:** When a finding in category C is resolved, the category score improves by `delta_c`. The weighted impact is:
```
expected_score_impact = weight[C] × delta_c / sum(weights_of_scored_categories)
```

**Example:** Reliability weight 0.15, category score improves from 3 to 6 (delta=3). With 4 scored categories (total weight 0.65): impact = 0.15 × 3 / 0.65 ≈ 0.69.

**Output fields:**
- `category_weights` — Weights used (must sum to 1.0)
- `remediation_summary.score_projection` — current_score, score_after_each_fix, score_after_top_3_fixes, final_projected_score

## Schema

`schemas/review-score.schema.json`
