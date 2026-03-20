# Schema Reference

All structured outputs from the AWS Repo Well-Architected Advisor conform to JSON schemas in `schemas/`.

---

## Schema Index

| Schema | Purpose | Example |
|--------|---------|---------|
| `review-score.schema.json` | Full review output (findings, scores, verdict) | `examples/validated-review-output.json` |
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
