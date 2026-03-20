# Usage Guide

How to use the AWS Repo Well-Architected Advisor.

---

## Quick Start

```bash
git clone <repo>
cd aws-repo-well-architected-advisor
cd .opencode && bun install   # or npm install
opencode run "/repo-assess"
```

---

## Commands

| Command | Use When |
|---------|----------|
| `/quick-review` | Fast triage; top 5 findings |
| `/repo-assess` | Full architecture assessment |
| `/solution-discovery` | Starting design; need requirements |
| `/platform-design` | Have requirements; need reference architecture |
| `/scaffold` | Have design; need Terraform/CDK |
| `/design-and-implement` | End-to-end: read repo → requirements → recommend → code |
| `/incremental-fix` | Existing repo; patch-style fixes |
| `/federal-checklist` | NIST/DoD compliance review |
| `/quality-gate` | Production readiness gate |

---

## Structured Outputs

The advisor produces schema-backed artifacts:

| Artifact | Schema | When |
|----------|--------|------|
| Review output | review-score.schema.json | /repo-assess |
| Workload profile | workload-profile.schema.json | /solution-discovery, /design-and-implement |
| Architecture model | architecture-model.schema.json | /platform-design |
| Decision log | decision-log.schema.json | /platform-design |
| Cost analysis | cost-analysis.schema.json | /platform-design |
| Architecture graph | architecture-graph.schema.json | /design-and-implement |
| Mermaid diagram | diagram field | /repo-assess, /design-and-implement |
| Deployment plan | deployment-plan.schema.json | /scaffold |
| Verification checklist | verification-checklist.schema.json | /scaffold |
| Operations runbook | operations-runbook.schema.json | /scaffold |
| **Pricing input** | pricing-input.schema.json | Optional; estimate_costs.py |
| **Pricing estimate** | pricing-estimate.schema.json | Optional; estimate_costs.py |
| **Drift report** | drift-report.schema.json | Optional; detect_drift.py |
| **Org topology** | org-topology.schema.json | Optional; build_org_topology.py |
| **Remediation plan** | remediation-plan.schema.json | Optional; generate_patch_plan.py |

---

## Mermaid Diagrams

1. Advisor produces `architecture_graph` (structured)
2. Build graph: `python3 scripts/build_architecture_graph.py --scenario <scenario.json>`
3. Render: `python3 scripts/graph_to_mermaid.py <graph.json> [output.mmd]`
4. Validate: `python3 scripts/validate_mermaid.py <graph.json> [diagram.mmd]` or `npm run validate:diagrams`

See [diagram-conventions.md](diagram-conventions.md).

---

## Validation

```bash
npm run validate          # review-score schema
node tests/validate-schemas.js   # all schemas
npm test                 # full test suite
```

---

## See Also

- [commands.md](commands.md)
- [schemas.md](schemas.md)
- [testing.md](testing.md)
- [cost-model.md](cost-model.md) — Cost analysis
- [pricing-integration.md](pricing-integration.md) — Pricing API integration (planned)
- [drift-detection.md](drift-detection.md) — Drift detection
- [multi-account.md](multi-account.md) — Org/Control Tower
- [remediation.md](remediation.md) — Patch/remediation
