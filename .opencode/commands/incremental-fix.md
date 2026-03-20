---
description: Targeted patch-style fixes for existing repos
agent: scaffold-implementer
---

# /incremental-fix

## Intent

Incremental fix mode: generate minimal targeted fixes for existing repos. No full rebuild.

## When to Run

- Existing repo with gaps from /repo-assess or /federal-checklist
- User wants patch-style changes, not greenfield scaffold
- Terraform/IAM/CI/CD/security corrections

## Required Context

- Prior /repo-assess findings, or run repo-discovery first

## Steps

1. Run repo-discovery or use prior findings
2. Identify top gaps (prioritize by severity)
3. Generate patch-style fixes: Terraform patches, IAM corrections, CI/CD updates, security fixes
4. Each fix MUST include: risk_reduction, affected_control_area, effort, priority, evidence_required_to_close
5. Output per schemas/incremental-fix.schema.json

## Output Contract

- fixes[] with: id, title, risk_reduction, affected_control_area, effort, priority, evidence_required_to_close, patch_type, target_files, patch_content
