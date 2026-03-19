---
description: Orchestrate multi-phase review
agent: repo-auditor
---

# /orchestrate

## Intent

Orchestrate full review in phases. Track state between phases. Support checkpointing and resume.

## When to Run

- Large or complex repo
- Multi-session review
- When phased execution is preferred

## Required Context

- Repository to review
- Optional: checkpoint from prior session

## Steps

1. **Phase 1 — Discovery** — repo-discovery, artifact inventory
2. **Phase 2 — Inference** — architecture-inference, current design
3. **Phase 3 — Specialist reviews** — security, networking, reliability, DevOps, FinOps, observability, compliance
4. **Phase 4 — Scoring** — weighted score, letter grade, verdict
5. **Phase 5 — Report** — final report per template

## Routing to Agents/Skills

- Agent: repo-auditor
- Skills: full aws-well-architected-pack in execution order

## Output Contract

- Schema: schemas/review-score.schema.json
- Per-phase outputs preserved for checkpoint

## Quality Bar

- State preserved between phases
- /checkpoint can snapshot at any phase

## Exit Criteria

- All phases complete
- Final report produced
