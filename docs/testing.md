# Testing

How the AWS Repo Well-Architected Advisor is tested.

---

## Test Categories

### 1. Schema Validation

- **review-score**: `examples/validated-review-output.json` vs `schemas/review-score.schema.json`
- **All artifacts**: `examples/scenarios/startup-workload.json` extracts workload_profile, architecture_model, decision_log, cost_analysis, architecture_graph, deployment_plan, verification_checklist, operations_runbook and validates each against its schema

```bash
node tests/validate-schemas.js
```

### 2. Review Score Logic

- `scoreToLetter()` mapping
- `computeReviewScore()` weighted scoring

### 3. Evidence Extractor

- Tag extraction from markdown
- Finding validation (required evidence tags)

### 4. Quality Gate

- Verdict structure (READY / CONDITIONAL / NOT_READY)

### 5. Install Scripts

- `install.sh`, `install.ps1` exist

### 6. Mermaid / Diagram Validation

- Architecture graph: nodes, edges, zone consistency
- Mermaid syntax: flowchart/sequenceDiagram structure, balanced subgraphs

```bash
node scripts/validate-mermaid.js examples/architecture-graph-example.json examples/architecture-diagram-example.mmd
```

### 7. Platform Configs

- `.opencode/opencode.json`, `.cursor/rules`, `.claude/CLAUDE.md` exist

---

## Running Tests

```bash
npm test
```

---

## Golden Scenarios

Example outputs for representative workloads:

| Scenario | File | Validates |
|----------|------|-----------|
| Startup web app | `examples/scenarios/startup-workload.json` | All artifact schemas |
| Federal/regulated | `examples/scenarios/federal-workload.json` | — |
| Brownfield review | `examples/scenarios/brownfield-review.json` | — |

---

## CI Integration

`.github/workflows/ci.yml` runs `npm test` and schema validation on push/PR.

---

## Adding New Tests

1. Add schema: `schemas/<name>.schema.json`
2. Add example: `examples/<name>-example.json` or in `examples/scenarios/`
3. Add to `tests/validate-schemas.js` if it should run in CI
