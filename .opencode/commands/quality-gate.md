---
description: Production readiness quality gate
agent: repo-auditor
---

# /quality-gate

## Intent

Run production readiness gate. Produce verdict. Write result to .opencode/quality-gate-result.json. Block push when NOT_READY and enforced.

## When to Run

- Before push (manual or via hook)
- Pre-deployment
- After remediation to re-check

## Required Context

- Repository under review
- Optional: prior /repo-assess output for incremental check

## Steps

1. Execute full review pipeline (same as /repo-assess)
2. Compute verdict from findings
3. Write .opencode/quality-gate-result.json
4. Return verdict and blocking status

## Routing to Agents/Skills

- Agent: repo-auditor
- Skills: full aws-well-architected-pack pipeline

## Output Contract

- Schema: schemas/review-score.schema.json
- File: .opencode/quality-gate-result.json with verdict, timestamp, score, letter_grade

## Quality Bar

- Verdict derived from rules: CRITICAL→NOT_READY, HIGH→CONDITIONAL, else READY
- File written for pre-push hook

## Exit Criteria

- Verdict produced
- quality-gate-result.json written
- If NOT_READY and AWS_PACK_ENFORCE_QUALITY_GATE=true: push blocked
