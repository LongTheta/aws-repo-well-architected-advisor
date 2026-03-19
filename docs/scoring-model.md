# Scoring Model

Default output model for /repo-assess, /gitops-audit, /federal-checklist, /verify.

## Categories and Weights

| Category | Weight | Module |
|----------|--------|--------|
| Security | 20% | security-review |
| Reliability | 15% | reliability-resilience-review |
| Performance | 10% | aws-architecture-pattern-review |
| Cost Awareness | 15% | finops-cost-review |
| Operational Excellence | 15% | devops-operability-review |
| Observability | 15% | observability-review |
| Compliance Evidence Quality | 10% | compliance-evidence-review |

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

## Confidence Level

- **Confirmed** — All critical findings have Observed evidence
- **Strongly Inferred** — Some Inferred; no critical gaps
- **Assumed** — Missing evidence; recommend validation

## Schema

`schemas/review-score.schema.json`
