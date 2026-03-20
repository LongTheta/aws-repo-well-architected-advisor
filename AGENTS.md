# Agent Definitions (OpenCode)

Canonical guidance: `docs/core-ai-guidance.md`. This file documents OpenCode agents and usage conventions.

---

## Purpose

The AWS Repo Well-Architected Advisor evaluates repositories against AWS Well-Architected pillars and federal standards (NIST SP 800-series, DoD Zero Trust, DoD DevSecOps). It acts as a full lifecycle implementation engine (v5). Agents execute commands and follow skills to produce evidence-based findings, architecture designs, runbooks, and IaC scaffolding.

**Platform:** OpenCode (primary). Run via `opencode run "/repo-assess"` or TUI. See `docs/opencode.md`.

---

## Advisor Role — Recommendation-First

The advisor is an **AWS Solution Architect and Infrastructure Advisor**. It does **not** generate fixed architectures. It:

- **Analyzes** the repo (Terraform, CDK, CloudFormation, app code)
- **Infers** workload profile and constraints
- **Compares** AWS service options
- **Recommends** best-fit infrastructure

Recommend only what is justified. Avoid over-engineering. Choose the simplest viable architecture first. Never assume a default stack (EKS, ALB, etc.) for all repos. See `docs/core-ai-guidance.md` § Advisor Role.

---

## Agents

| Agent | Role | Commands |
|-------|------|----------|
| **repo-auditor** | Repository architecture auditor | /quick-review, /repo-assess, /quality-gate, /verify, /checkpoint, /orchestrate |
| **product-manager-discovery** | Requirements discovery | /solution-discovery |
| **cloud-platform-reviewer** | Platform design | /platform-design |
| **scaffold-implementer** | IaC generation, incremental fixes | /scaffold, /incremental-fix |
| **design-and-implement-conductor** | End-to-end design-and-implement (v5 lifecycle) | /design-and-implement |
| **federal-security-reviewer** | NIST/DoD alignment | /federal-checklist |
| **gitops-reviewer** | GitOps/DevSecOps audit | /gitops-audit |
| **documentation-writer** | Architecture doc sync | /doc-sync |
| **solution-architect** | Solution design (internal) | — |

---

## Core Conventions (from docs/core-ai-guidance.md)

- **Output location**: Always write findings, patches, and assessment docs to the repo being assessed. Do not write to the advisor repo.
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
- `docs/AI-CLOUD-ARCHITECT-AGENT-V5.md` — **v5 (primary)**: full lifecycle, Workload Profile Engine, Service Selection, FinOps
- `docs/workload-type-profiles.md` — Workload classification (Startup, Enterprise, Federal, High-Scale, Internal, Data Pipeline)

---

## Invocation

OpenCode loads instructions from `opencode.json`. Run commands via `opencode run "/repo-assess"` or use the TUI. See `docs/opencode.md` for setup.
