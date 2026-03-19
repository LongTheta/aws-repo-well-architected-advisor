# Report Template

Standard structure for review output. Conform to `schemas/review-score.schema.json`.

## Sections

1. **Executive Summary** — Health, strengths, risks, suitability
2. **Scope Reviewed** — Artifacts, modules run, evidence sources
3. **Inferred AWS Architecture** — Components with evidence type
4. **Weighted Scorecard** — Categories, scores, gaps
5. **Top Risks** — Ranked by severity
6. **Evidence Found** — Observed and Inferred items
7. **Missing Evidence** — What could not be determined
8. **Role-Based Findings** — Architect, Developer, Security, Operations
9. **Prioritized Remediation Backlog** — P1, P2, P3
10. **Production Readiness Decision** — Verdict, rationale
11. **Suggested Target Architecture** — Recommendations
12. **Next Review Pass** — When to re-run

## Required Fields

- `weighted_overall_score`
- `letter_grade`
- `production_readiness`
- `confidence_level`
- `findings[]` with `evidence_type`, `confidence`, `severity`

## Template Source

`skills/aws-well-architected-pack/scoring/report-template.md`
