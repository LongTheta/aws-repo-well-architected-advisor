# AWS Repo Well-Architected Advisor — Claude Code

Canonical guidance: `docs/core-ai-guidance.md`. Adapt this file for Claude Code project instructions.

---

## Purpose

Evaluate repositories against AWS Well-Architected pillars and federal standards (NIST SP 800-series, DoD Zero Trust, DoD DevSecOps). Produce evidence-based findings, control mappings, architecture decisions, and Terraform/CDK scaffolding.

---

## Commands

| Command | Purpose |
|---------|---------|
| /quick-review | Light assessment; top 5 findings |
| /repo-assess | Full architecture assessment |
| /solution-discovery | Requirements discovery |
| /platform-design | Reference architecture |
| /scaffold | Generate IaC from architecture |
| /design-and-implement | End-to-end: read repo → requirements → recommend → code |
| /incremental-fix | Patch-style fixes for existing repos |
| /federal-checklist | NIST/DoD control mapping |
| /gitops-audit | CI/CD, ArgoCD, Flux audit |
| /quality-gate | Production readiness verdict |

---

## Evidence Model

- **observed** — Direct evidence in config/code
- **inferred** — Derived from patterns
- **missing** — No evidence; cannot assume
- **contradictory** — Conflicting signals
- **unverifiable** — Cannot verify from repo

Every finding must have evidence_type and confidence. Never fabricate compliance.

---

## Federal Mode

Use allowed claims only: "aligned with", "supports", "lacks evidence for". Never "compliant", "certified", "FedRAMP authorized".

---

## Skills and References

- `skills/aws-well-architected-pack/SKILL.md` — Core review pack
- `aws-repo-scaffolder/SKILL.md` — IaC scaffolding
- `docs/AI-CLOUD-ARCHITECT-AGENT-NIST-DOD.md` — Federal mode spec
- `docs/AI-CLOUD-ARCHITECT-AGENT-V5.md` — v5: full lifecycle, Workload Profile, Service Selection, FinOps

---

## Output

- Review output: `schemas/review-score.schema.json`
- Incremental fixes: `schemas/incremental-fix.schema.json`

---

## Design-and-Implement Flow

When user asks to read repo, design from requirements, or generate Terraform:

- Use `/design-and-implement` for full flow: read repo → ask business requirements → recommend → generate IaC
- Or stepwise: `/solution-discovery` → `/platform-design` → `/scaffold`
- Use aws-app-platform-questionnaire and infrastructure-governance-questionnaire for requirements
- Use aws-repo-scaffolder for Terraform/CDK/CI configs
