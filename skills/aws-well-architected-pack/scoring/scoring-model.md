# AWS Well-Architected Pack — Weighted Scoring Model

## Categories and Weights

| Category | Weight | Module(s) | Score 0–10 |
|----------|--------|-----------|-------------|
| Security | 20% | security-review | |
| Reliability | 15% | reliability-resilience-review | |
| Performance Efficiency | 10% | aws-architecture-pattern-review | |
| Cost Optimization | 15% | finops-cost-review | |
| Operational Excellence | 15% | devops-operability-review | |
| Observability | 15% | observability-review | |
| Compliance Evidence Quality | 10% | compliance-evidence-review | |

**Note**: If a category has no evidence (module skipped or no artifacts), weight is redistributed proportionally among scored categories.

## Per-Category Structure

For each category, produce:

- **Score** (0–10)
- **Rationale** — Why this score; key factors
- **Evidence found** — Observed and Inferred items
- **Missing evidence** — What could not be determined
- **Key risks** — Top 1–3 risks in this category
- **Recommended actions** — Prioritized next steps

## Score Interpretation (0–10)

| Range | Interpretation | Letter Grade |
|-------|----------------|--------------|
| 9–10 | Excellent alignment; minor gaps | A |
| 8–8.9 | Good; some improvements needed | B+ |
| 7–7.9 | Adequate; notable gaps | B |
| 5–6.9 | Moderate; significant gaps | C |
| 3–4.9 | Weak; major remediation required | D |
| 0–2.9 | Critical gaps; not production-ready | F |

## Final Outputs

- **Weighted overall score** — Sum of (category_score × weight) for all scored categories
- **Letter grade** — From overall score
- **Production readiness** — READY | CONDITIONAL | NOT READY
- **Confidence level** — Confirmed | Strongly Inferred | Assumed

## Production Readiness Rules

| Condition | Verdict |
|-----------|---------|
| Any CRITICAL finding | NOT_READY |
| Any HIGH finding | CONDITIONAL |
| Missing required tags in prod | CONDITIONAL |
| Missing evidence in regulated review (critical control) | CONDITIONAL |
| All MEDIUM or lower, evidence adequate | READY |

## Confidence Level

| Level | Definition |
|-------|------------|
| **Confirmed** | All critical findings have Observed evidence |
| **Strongly Inferred** | Some Inferred evidence; no critical gaps |
| **Assumed** | Missing evidence in important areas; recommend validation |
