---
description: Full repository architecture assessment
agent: repo-auditor
---

# /repo-assess

## Intent

Assess repository architecture against AWS Well-Architected pillars. Produce evidence-based findings, weighted scorecard, production readiness verdict.

## When to Run

- Repo onboarding
- Pre-production review
- Architecture assessment request
- After significant IaC or platform changes

## Required Context

- Repository with IaC (Terraform, CDK, CloudFormation) and/or CI/CD, K8s
- No prior context required; discovery is first step

## Steps

1. **Discovery** — repo-discovery: inventory artifacts
2. **Inference** — architecture-inference: map current design
3. **Security** — security-review: IAM, secrets, encryption
4. **Networking** — networking-review: VPC, subnets, segmentation
5. **Observability** — observability-review: metrics, logs, traces
6. **Scoring** — compute weighted score, letter grade
7. **Report** — produce report per schema

## Routing to Agents/Skills

- Agent: repo-auditor
- Skills: skills/aws-well-architected-pack (modules: repo-discovery, architecture-inference, security-review, networking-review, observability-review)

## Output Contract

- Schema: schemas/review-score.schema.json
- Sections: Executive Summary, Scope, Inferred Architecture, Scorecard, Top Risks, Evidence Found, Missing Evidence, Role-Based Findings, Remediation Backlog, Production Readiness

## Quality Bar

- All findings have evidence_type and confidence
- Verdict present (READY / CONDITIONAL / NOT_READY)
- No fabricated evidence

## Exit Criteria

- Report complete
- Scorecard populated
- Verdict stated
