# AWS Well-Architected Pack — Claude Code

Use this repo for evidence-based AWS architecture review. Reference `skills/aws-well-architected-pack/SKILL.md`.

## Commands (when available)

- **Full assessment**: Run repo-discovery → architecture-inference → security-review → networking-review → observability-review → scoring
- **Federal compliance**: evidence extraction → control-family mapping → readiness report
- **Quality gate**: Produce verdict READY | CONDITIONAL | NOT_READY

## Evidence model

- **observed** — Direct evidence in config/code
- **inferred** — Derived from patterns
- **missing** — No evidence; cannot assume
- **contradictory** — Conflicting signals

Output per `schemas/review-score.schema.json`.
