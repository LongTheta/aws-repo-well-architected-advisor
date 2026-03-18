# AWS Repo Scaffolder

Scaffolds AWS infrastructure repos from architecture decisions or review findings. **Bridges design/review → implementation.**

---

## What This Does

Takes the output of:
- **architecture-decision-engine** (design mode)
- **cloud-architecture-ai-auditor** (review + remediation plan)

And produces:
- Terraform or CDK scaffolding
- Repo structure with required tags
- Security defaults (no public DB, no wildcard IAM, Secrets Manager)
- CI/CD skeleton

---

## When to Use

- "Scaffold from this design"
- "Generate Terraform from these findings"
- "Build the repo for this architecture"
- After a Spec-Driven design or Repo-Driven review

---

## Input

Provide:
1. Architecture summary (compute, data, networking, IAM)
2. Recommended AWS services
3. Remediation plan (if from review)
4. IaC preference: Terraform or CDK

---

## Output

- `infra/` or `terraform/` directory structure
- `main.tf`, `variables.tf`, `outputs.tf` (or CDK equivalents)
- Required tags on all resources
- `.github/workflows/deploy.yml` or `.gitlab-ci.yml` skeleton
- README with setup steps

---

## Required Tags

All scaffolded resources include:
- Project, Environment, Owner, CostCenter, ManagedBy, Purpose, DataClassification, Lifecycle

---

## Safety

- Output is **scaffolding** — starting point, not production-ready
- User must review before `terraform apply` or `cdk deploy`
- No real secrets; use variable placeholders or Secrets Manager ARN references

---

## Usage

Paste the prompt from `scaffold-prompt.md` with your architecture summary and findings.
