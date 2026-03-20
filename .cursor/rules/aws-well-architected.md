---
description: AWS Repo Well-Architected Advisor — evidence-based architecture review
globs: ["**/*.tf", "**/*.tfvars", "**/*.yaml", "**/*.yml", "**/Dockerfile", "**/.github/**"]
alwaysApply: false
---

# AWS Repo Well-Architected Advisor

Canonical guidance: `docs/core-ai-guidance.md`. This rule applies when editing IaC/CI files.

## Purpose

Evaluate repositories against AWS Well-Architected pillars and federal standards (NIST SP 800-series, DoD Zero Trust, DoD DevSecOps). Produce evidence-based findings, control mappings, and Terraform/CDK scaffolding.

## Evidence Model

- **observed** — Direct evidence in config/code
- **inferred** — Derived from patterns
- **missing** — No evidence; cannot assume
- **contradictory** — Conflicting signals
- **unverifiable** — Cannot verify from repo

Never assume compliance without evidence. Never fabricate inherited controls.

## Federal Mode

Use allowed claims only: "aligned with", "supports", "lacks evidence for". Never "compliant", "certified", "FedRAMP authorized".

## Review Flow

repo-discovery → architecture-inference → security-review → networking-review → observability-review → scoring

Output per `schemas/review-score.schema.json`.

## AWS Service Selection & Cost Optimization

When designing or recommending: consider full AWS service scope (no fixed shortlist); compare ≥2 viable options per component; prefer lowest-cost that meets constraints; output per policy §9; if cheapest not recommended, explain per §10. See `cloud-architecture-ai-auditor/aws-service-selection-policy.md`.

## Design-and-Implement Flow

When user asks to "read this repo", "design from requirements", "recommend and implement", or "generate Terraform from this design":

- Use `/design-and-implement` for full flow: read repo → ask business requirements → recommend → generate IaC
- Or run stepwise: `/solution-discovery` (with repo context) → `/platform-design` → `/scaffold`
- Use aws-app-platform-questionnaire for requirements; aws-repo-scaffolder for Terraform/CDK/CI configs

## Commands

/quick-review, /repo-assess, /solution-discovery, /platform-design, /scaffold, /design-and-implement, /incremental-fix, /federal-checklist, /gitops-audit, /quality-gate, /verify, /doc-sync

## vNext Lifecycle (design-and-implement, scaffold)

Discover → Infer → Model → Decide → Design → Validate → Generate → Verify → Operate → Document → Improve. See `docs/AI-CLOUD-ARCHITECT-AGENT-VNEXT.md`.
