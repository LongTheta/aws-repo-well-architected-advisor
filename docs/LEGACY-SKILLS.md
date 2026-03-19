# Legacy Skills Relationship

This repo contains both the **OpenCode-native skill pack** (`skills/aws-well-architected-pack/`) and **legacy skill artifacts** from the pre-OpenCode design. This document clarifies how they relate.

## Primary: AWS Well-Architected Pack

**Location**: `skills/aws-well-architected-pack/`

The pack is the **primary** implementation for OpenCode. It provides:

- **Conductor** (`SKILL.md`) — orchestrates modules, aggregates findings, computes scores
- **10 specialist modules** — repo-discovery, architecture-inference, aws-architecture-pattern-review, security-review, networking-review, reliability-resilience-review, devops-operability-review, finops-cost-review, observability-review, compliance-evidence-review
- **Scoring** — `scoring/scoring-model.md`, `scoring/report-template.md`
- **Routing** — `routing/trigger-matrix.yaml`

**Invoked by**: OpenCode commands (`/repo-assess`, `/quality-gate`, `/federal-checklist`, `/gitops-audit`, etc.) and agents (repo-auditor, federal-security-reviewer, gitops-reviewer).

## Legacy Artifacts (Reference Only)

| Legacy Path | Purpose | Relationship to Pack |
|-------------|---------|----------------------|
| `cloud-architecture-ai-auditor/` | Original orchestration, samples, rules, execution order | **Superseded** by pack conductor + modules. Content migrated per `skills/aws-well-architected-pack/MIGRATION_MAP.md`. Kept for reference, samples, and migration traceability. |
| `security-review/` | Standalone security skill at repo root | **Superseded** by `skills/aws-well-architected-pack/modules/security-review/`. Use the pack module. |
| `skill-trigger-matrix.yaml` (root) | Legacy Cursor trigger matrix | **Superseded** by pack `routing/trigger-matrix.yaml` and OpenCode commands. |
| `review-mode-definitions.md` (root) | Legacy review modes | **Superseded** by pack conductor and `docs/OPERATING-MODEL.md`. |

## When to Use What

- **OpenCode workflows**: Use the pack. Commands and agents reference `skills/aws-well-architected-pack/SKILL.md` in instructions.
- **Samples and examples**: Legacy `cloud-architecture-ai-auditor/samples/` contain useful sample reports; `examples/validated-review-output.json` and `examples/sample-review-report.md` are schema-conformant.
- **Migration or debugging**: Use `skills/aws-well-architected-pack/MIGRATION_MAP.md` to trace legacy → pack mappings.

## Deprecation Status

| Artifact | Status |
|----------|--------|
| Pack (skills/aws-well-architected-pack) | **Active** — primary |
| cloud-architecture-ai-auditor | **Reference** — do not invoke directly |
| security-review (root) | **Reference** — use pack module |
| Root skill-trigger-matrix.yaml | **Reference** — use pack routing |

## Future Cleanup

Legacy directories may be archived or removed in a future release once all consumers have migrated to the pack. Until then, they remain for reference and migration support.
