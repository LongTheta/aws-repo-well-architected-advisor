---
description: Light assessment (QUICK_REVIEW mode)
agent: repo-auditor
---

# /quick-review

## Intent

QUICK_REVIEW mode: fast light assessment. Skip full multi-pass.

## When to Run

- Need fast feedback
- Initial triage before full /repo-assess
- Quick grade and top risks

## Steps

1. Repo-discovery
2. Top risks identification
3. Score (letter_grade, production_readiness)
4. Output: top 5 findings

## Output Contract

- letter_grade
- production_readiness (READY | CONDITIONAL | NOT_READY)
- top 5 findings
