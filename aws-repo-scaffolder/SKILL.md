---
name: aws-repo-scaffolder
description: Scaffolds AWS infrastructure repos from architecture decisions or review findings. Takes architecture summary, recommended services, and remediation plan as input; produces Terraform or CDK scaffolding with required tags, security defaults, and CI/CD skeleton. Use when user wants to build from design output, generate IaC from findings, or scaffold a new repo.
risk_tier: 1
---

# AWS Repo Scaffolder

Scaffolds AWS infrastructure repos from architecture decisions or review findings. **Bridges design/review → implementation.**

## When to Use

- User has architecture design output and wants to start building
- User has review findings and wants IaC scaffolding that addresses them
- User says: "scaffold from this design", "generate Terraform from these findings", "build the repo"

## Input

- Architecture summary (compute, data, networking, IAM)
- Recommended AWS services
- Remediation plan (if from review)
- Preferred IaC: Terraform or CDK

## Output

- Repo structure (directories, files)
- Terraform or CDK scaffolding for recommended services
- Required tags on all resources
- Security defaults (private subnets, no 0.0.0.0/0, Secrets Manager for creds)
- CI/CD skeleton (GitHub Actions or GitLab CI)
- README with setup instructions

## Rules

- Include all 8 required tags: Project, Environment, Owner, CostCenter, ManagedBy, Purpose, DataClassification, Lifecycle
- No hardcoded secrets; use variables or Secrets Manager references
- No 0.0.0.0/0 on sensitive resources
- No wildcard IAM; use least-privilege placeholders
- Mark output as scaffolding — user must review before apply

## Files in This Skill

| File | Purpose |
|------|---------|
| `SKILL.md` | This file |
| `README.md` | Overview, usage |
| `scaffold-prompt.md` | Template prompt to paste |
| `example-input.md` | Sample architecture + findings input |
| `example-output.md` | Sample Terraform scaffolding |
