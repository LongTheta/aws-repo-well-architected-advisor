# Agent Definitions (OpenCode)

Canonical guidance: `docs/core-ai-guidance.md`. This file documents OpenCode agents and usage conventions.

---

## Purpose

The AWS Repo Well-Architected Advisor evaluates repositories against AWS Well-Architected pillars and federal standards (NIST SP 800-series, DoD Zero Trust, DoD DevSecOps). Agents execute commands and follow skills to produce evidence-based findings, architecture designs, and IaC scaffolding.

---

## Agents

| Agent | Role | Commands |
|-------|------|----------|
| **repo-auditor** | Repository architecture auditor | /quick-review, /repo-assess, /quality-gate, /verify, /checkpoint, /orchestrate |
| **product-manager-discovery** | Requirements discovery | /solution-discovery |
| **cloud-platform-reviewer** | Platform design | /platform-design |
| **scaffold-implementer** | IaC generation, incremental fixes | /scaffold, /incremental-fix |
| **design-and-implement-conductor** | End-to-end design-and-implement | /design-and-implement |
| **federal-security-reviewer** | NIST/DoD alignment | /federal-checklist |
| **gitops-reviewer** | GitOps/DevSecOps audit | /gitops-audit |
| **documentation-writer** | Architecture doc sync | /doc-sync |
| **solution-architect** | Solution design (internal) | — |

---

## Core Conventions (from docs/core-ai-guidance.md)

- **Evidence tags**: All findings use evidence_type (observed, inferred, missing, contradictory, unverifiable) and confidence
- **Never fabricate**: Do not assume compliance from naming or policy docs
- **Output schema**: Review output per `schemas/review-score.schema.json`
- **Federal mode**: Use allowed claims only; never "compliant", "certified", "FedRAMP authorized"

---

## Skills Referenced

- `skills/aws-well-architected-pack/SKILL.md` — Core review pack
- `aws-repo-scaffolder/SKILL.md` — IaC scaffolding
- `cloud-architecture-ai-auditor/aws-app-platform-questionnaire.md` — Business requirements
- `cloud-architecture-ai-auditor/infrastructure-governance-questionnaire.md` — Tagging, CIDR, roles

---

## Invocation

OpenCode loads instructions from `opencode.json`. Run commands via `opencode run "/repo-assess"` or use the TUI. See `docs/opencode.md` for setup.
