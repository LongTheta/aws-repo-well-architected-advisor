# AWS Repo Well-Architected Advisor

**Executable OpenCode platform pack for repository architecture reviews, solution discovery, platform design, GitOps audits, federal-grade evidence-based reviews, and pre-push quality enforcement.**

---

## What This Is

An **OpenCode operating system** — not a generic AI agent collection. Focused, opinionated, enterprise-grade.

- **Repository architecture reviews** — Evidence-based assessment against AWS Well-Architected
- **Solution architect discovery** — Requirements, constraints, compliance level
- **Platform design** — Reference architecture, decision log, tradeoffs
- **GitOps / DevSecOps audits** — CI/CD, ArgoCD/Flux, deployment safety
- **Federal-grade evidence-based reviews** — NIST control mapping, FedRAMP readiness
- **Pre-push quality enforcement** — Quality gate blocks push when NOT_READY (when enforced)

---

## Commands

| Command | Purpose |
|---------|---------|
| `/repo-assess` | Full repository architecture assessment |
| `/solution-discovery` | Requirements discovery for solution design |
| `/platform-design` | Platform design and reference architecture |
| `/federal-checklist` | Federal compliance (NIST, FedRAMP) review |
| `/gitops-audit` | GitOps and DevSecOps audit |
| `/quality-gate` | Production readiness gate; writes result for pre-push |
| `/doc-sync` | Sync architecture docs with inferred design |
| `/verify` | Verify findings have evidence tags |
| `/checkpoint` | Checkpoint review state |
| `/orchestrate` | Orchestrate multi-phase review |

---

## Agents

| Agent | Use Case |
|-------|----------|
| solution-architect | AWS design decisions |
| product-manager-discovery | Requirements discovery |
| repo-auditor | Architecture review, scoring, verification |
| federal-security-reviewer | NIST, FedRAMP |
| gitops-reviewer | CI/CD, GitOps |
| cloud-platform-reviewer | Platform design |
| documentation-writer | Doc sync |

---

## Skills

Core pack: `skills/aws-well-architected-pack/`

- 10 modules: repo-discovery, architecture-inference, aws-architecture-pattern-review, security-review, networking-review, reliability-resilience-review, devops-operability-review, finops-cost-review, observability-review, compliance-evidence-review
- Conductor SKILL.md orchestrates modules
- Trigger matrix routes file patterns and intents to modules

---

## Governance

**Plugin**: `.opencode/plugins/aws-well-architected-enforcement.ts`

- Blocks reading .env, secrets, .pem, .key
- Blocks push without quality gate when `AWS_PACK_ENFORCE_QUALITY_GATE=true`
- Flags infra edits for doc-sync
- Detects potential secrets in messages

**Pre-push hook**: `hooks/pre-push` — Checks `.opencode/quality-gate-result.json` before push.

**Output classification**: pass | pass with warnings | fail. See `docs/OPERATING-MODEL.md`.

---

## Evidence-First Review

All findings require:
- **evidence_type**: observed | inferred | missing | contradictory
- **confidence**: Confirmed | Strongly Inferred | Assumed

Never assume compliance. Never fabricate evidence.

---

## Scoring

Categories: Security, Reliability, Performance, Cost Awareness, Operational Excellence, Observability, Compliance Evidence Quality.

Output: weighted score (0–10), letter grade (A–F), production readiness (READY | CONDITIONAL | NOT_READY).

Schema: `schemas/review-score.schema.json`

---

## Quick Start

1. Clone. Ensure OpenCode installed.
2. `opencode run "/repo-assess"` or use TUI.
3. For pre-push enforcement: `cp hooks/pre-push .git/hooks/pre-push && chmod +x .git/hooks/pre-push` and `export AWS_PACK_ENFORCE_QUALITY_GATE=true`.

---

## Key Files

| File | Purpose |
|------|---------|
| [opencode.json](opencode.json) | Commands, agents, plugins |
| [.opencode/opencode.json](.opencode/opencode.json) | Control plane (canonical) |
| [.opencode/README.md](.opencode/README.md) | Config structure |
| [INSTALL.md](INSTALL.md) | Installation options |
| [.opencode/MIGRATION.md](.opencode/MIGRATION.md) | Doc-first → executable |
| [docs/command-to-skill-mapping.md](docs/command-to-skill-mapping.md) | Command → skill graphs |
| [docs/scoring-model.md](docs/scoring-model.md) | Scoring categories |
| [schemas/review-score.schema.json](schemas/review-score.schema.json) | Output schema |
| [llms.txt](llms.txt) | LLM orientation |

---

## How This Differs From Generic Packs

- **Focused**: Architecture review, federal compliance, GitOps — not general-purpose
- **Evidence-first**: No assumed compliance; findings must have evidence tags
- **Command-driven**: 10 commands with defined agents and skill graphs
- **Enforced**: Plugin blocks unsafe actions; quality gate can block push
- **Schema-backed**: All review output conforms to review-score.schema.json
