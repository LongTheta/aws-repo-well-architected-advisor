---
description: Federal compliance checklist
agent: federal-security-reviewer
---

# /federal-checklist

## Intent

Federal-grade evidence-based review. Map findings to NIST control families. Produce readiness report. Never assume compliance without evidence.

## When to Run

- Regulated or federal environment
- FedRAMP, NIST, DoD alignment request
- ATO preparation

## Required Context

- Repository with IaC, IAM, CI/CD
- Stop for missing evidence on critical controls

## Steps

1. Evidence extraction from repo
2. Control-family mapping (AC, IA, SC, AU, SI, CM, IR)
3. Gap analysis per control
4. FedRAMP readiness estimate
5. Readiness report

## Routing to Agents/Skills

- Agent: federal-security-reviewer
- Skills: compliance-evidence-review, security-review

## Output Contract

- Schema: schemas/review-score.schema.json
- Control coverage map, evidence per control, FedRAMP estimate

## Quality Bar

- Every control has evidence status (observed / inferred / missing)
- No assumed compliance
- Stop and report when critical control has no evidence

## Exit Criteria

- Control coverage map complete
- Readiness estimate stated
- Missing evidence explicitly called out
