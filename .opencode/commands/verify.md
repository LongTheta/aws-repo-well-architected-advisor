---
description: Verify findings and evidence
agent: repo-auditor
---

# /verify

## Intent

Verify that findings have required evidence tags. Validate severity and confidence. Check against schema.

## When to Run

- After /repo-assess, /federal-checklist, /gitops-audit
- Before accepting review output
- Quality assurance on AI-generated findings

## Required Context

- Findings (from prior review or inline)

## Steps

1. Extract findings from context or input
2. Check each finding for evidence_type (observed, inferred, missing, contradictory, unverifiable)
3. Check each finding for confidence (Confirmed, Strongly Inferred, Assumed) and/or confidence_score (0–1)
4. When federal mode: check source_reference, affected_standard, implementation_status
5. Validate against schemas/review-score.schema.json
6. Produce verification report: pass | pass_with_warnings | fail

## Routing to Agents/Skills

- Agent: repo-auditor
- Tool: evidence-extractor (when implemented)

## Output Contract

- validation_result: pass | pass_with_warnings | fail
- findings_without_tags: list
- schema_validation: pass | fail

## Quality Bar

- Findings without evidence tags → fail
- Schema violations → fail

## Exit Criteria

- Verification report produced
- Clear pass/fail outcome
