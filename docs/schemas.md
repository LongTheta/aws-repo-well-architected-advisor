# Schema Reference

All structured outputs from the AWS Repo Well-Architected Advisor conform to JSON schemas in `schemas/`.

**Terminology:** Use schema enum values in JSON (e.g. `cost_optimization`, `operational_excellence`). Display names (e.g. "Cost Awareness") may vary in reports. Canonical schema: `schemas/review-score.schema.json`; `skills/aws-well-architected-pack/scoring/review-score.schema.json` is synced via `npm run sync:schemas`.

---

## Schema Index

| Schema | Purpose | Example |
|--------|---------|---------|
| `review-score.schema.json` | Full review output (findings, scores, verdict, production_baseline, remediation_summary) | `examples/validated-review-output.json` |
| `workload-profile.schema.json` | Detected workload type | `examples/golden/startup-saas/workload_profile.json` |
| `architecture-model.schema.json` | Normalized architecture model | `examples/golden/startup-saas/architecture_model.json` |
| `decision-log.schema.json` | Architecture decisions | `examples/golden/startup-saas/decision_log.json` |
| `cost-analysis.schema.json` | Cost analysis per component | `examples/golden/startup-saas/cost_analysis.json` |
| `architecture-graph.schema.json` | Graph for Mermaid generation | `examples/golden/startup-saas/architecture_graph.json` |
| `deployment-plan.schema.json` | Phased deployment | `examples/golden/startup-saas/deployment_plan.json` |
| `verification-checklist.schema.json` | Post-deploy checks | `examples/golden/startup-saas/verification_checklist.json` |
| `operations-runbook.schema.json` | Operational procedures | `examples/golden/startup-saas/operations_runbook.json` |
| `incremental-fix.schema.json` | Patch-style fixes | `examples/incremental-fix/sample-incremental-fix.json` |
| `control-evidence.schema.json` | Federal control-to-evidence mapping | /federal-checklist output |

---

## Review Output (Engineering Execution)

Review output per `review-score.schema.json` is designed for engineering execution: "how to fix it step-by-step", not just "what is wrong".

**Every finding includes:** id, title, severity, category, blocking_status, affected_files, evidence, **impact**, recommendation, **remediation_plan**, **expected_score_impact**, implementation_effort.

**remediation_plan:** steps (ordered), terraform_resources, example_code, dependencies, validation_steps.

**Security analysis** (per docs/security-analysis.md): Five detection areas (missing IAM, overly permissive policies, missing encryption, missing Secrets Manager, missing network isolation). Each finding: evidence, impact, remediation.

**Production baseline** (per docs/production-baseline.md):
- `production_baseline.required_components` — Required components for production readiness
- `production_baseline.missing_components` — Which are missing
- `production_baseline.not_ready_reason` — **Required when NOT_READY**; explicit statement, not implied

**Remediation ordering** (per docs/remediation-ordering.md):
- `ordered_remediation_plan` — All finding IDs in execution order (deployment_blocker → security → reliability → cost/optimization)
- `ordering_reasoning` — Explanation of why findings are ordered this way

**Score projection** (based on category weights per docs/scoring-model.md):
- `category_weights` — Weights used for weighted score
- `remediation_summary.score_projection` — current_score, score_after_each_fix, score_after_top_3_fixes, final_projected_score

---

## Validation

```bash
# Review output
npx ajv-cli validate -s schemas/review-score.schema.json -d examples/validated-review-output.json

# All schemas (via test runner)
node tests/validate-schemas.js
npm test
```

---

## Artifact Flow

```
/solution-discovery  → solution-brief (workload_profile, architecture_model)
/platform-design     → architecture_model, decision_log, cost_analysis
/design-and-implement → all artifacts + architecture_graph, deployment_plan,
                        verification_checklist, operations_runbook
/repo-assess         → review-score (findings, diagram)
```

---

## See Also

- [testing.md](testing.md) — How tests use schemas
- [cost-model.md](cost-model.md) — Cost analysis structure
- [diagram-conventions.md](diagram-conventions.md) — Architecture graph → Mermaid
