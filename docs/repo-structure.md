# Repository Structure

Major folders and files in the AWS Repo Well-Architected Advisor.

---

## Root

| File / Folder | Purpose | Type |
|---------------|---------|------|
| `opencode.json` | Root OpenCode config (commands, agents, instructions) | Config |
| `AGENTS.md` | Agent definitions and usage conventions | Docs |
| `RULES.md` | Project rules (loaded by instructions) | Config |
| `install.sh` | Unix install script | Script |
| `install.ps1` | Windows install script | Script |
| `package.json` | Node.js package (tests, validate script) | Config |
| `INSTALL.md` | Installation guide | Docs |
| `TROUBLESHOOTING.md` | FAQ and common issues | Docs |

---

## .opencode/

OpenCode control plane.

| Path | Purpose | Type |
|------|---------|------|
| `.opencode/opencode.json` | Full config (commands, agents, plugin, instructions) | Config |
| `.opencode/plugins/` | Plugin (aws-well-architected-enforcement.ts) | Runtime |
| `.opencode/tools/` | Tool specs (review-score, evidence-extractor, quality-gate-check) | Config |
| `.opencode/commands/` | Command definitions (.md files) | Config |
| `.opencode/package.json` | Plugin dependencies | Config |

---

## .claude/

Claude Code configuration.

| Path | Purpose | Type |
|------|---------|------|
| `.claude/CLAUDE.md` | Project instructions for Claude Code | Config |

---

## .cursor/

Cursor IDE configuration.

| Path | Purpose | Type |
|------|---------|------|
| `.cursor/rules/aws-well-architected.md` | Cursor rule for AWS architecture review | Config |

---

## skills/

Skill packs. Primary: `aws-well-architected-pack`.

| Path | Purpose | Type |
|------|---------|------|
| `skills/aws-well-architected-pack/SKILL.md` | Conductor; invokes 10 specialist modules | Skill |
| `skills/aws-well-architected-pack/modules/` | repo-discovery, architecture-inference, security, networking, reliability, devops, finops, observability, compliance | Skill |
| `skills/aws-well-architected-pack/references/` | evidence-model, severity-model, checklist | Reference |
| `skills/aws-well-architected-pack/routing/` | trigger-matrix.yaml | Config |

---

## aws-repo-scaffolder/

IaC generation skill (separate from pack).

| Path | Purpose | Type |
|------|---------|------|
| `aws-repo-scaffolder/SKILL.md` | Terraform/CDK scaffolding rules | Skill |
| `aws-repo-scaffolder/README.md` | Overview | Docs |

---

## cloud-architecture-ai-auditor/

Questionnaires and discovery assets.

| Path | Purpose | Type |
|------|---------|------|
| `cloud-architecture-ai-auditor/aws-app-platform-questionnaire.md` | Business requirements | Config |
| `cloud-architecture-ai-auditor/infrastructure-governance-questionnaire.md` | Tagging, CIDR, IAM roles | Config |
| `cloud-architecture-ai-auditor/samples/` | Sample repos, reports | Examples |

---

## schemas/

JSON schemas for output validation.

| Path | Purpose | Type |
|------|---------|------|
| `schemas/review-score.schema.json` | Review output (scorecard, findings, verdict) | Schema |
| `schemas/solution-brief.schema.json` | Solution brief with infrastructure_config | Schema |
| `schemas/incremental-fix.schema.json` | Patch-style fixes | Schema |
| `schemas/command-routing.schema.json` | Command-to-agent routing | Schema |

---

## docs/

Documentation.

| Path | Purpose | Type |
|------|---------|------|
| `docs/AI-CLOUD-ARCHITECT-AGENT.md` | v2 agent spec | Docs |
| `docs/AI-CLOUD-ARCHITECT-AGENT-NIST-DOD.md` | v3 NIST/DoD overlay | Docs |
| `docs/core-ai-guidance.md` | Canonical AI guidance (AGENTS.md, CLAUDE.md, .cursor/rules) | Docs |
| `docs/architecture.md` | Architecture overview | Docs |
| `docs/commands.md` | Command reference | Docs |
| `docs/modes.md` | Mode routing | Docs |
| `docs/evidence-model.md` | Evidence model | Docs |
| `docs/federal-mode.md` | Federal/NIST/DoD | Docs |
| `docs/installation.md` | Installation | Docs |
| `docs/opencode.md` | OpenCode usage | Docs |
| `docs/cursor.md` | Cursor usage | Docs |
| `docs/claude.md` | Claude Code usage | Docs |
| `docs/ravvix.md` | Ravvix (provisional) | Docs |
| `docs/development.md` | Development guide | Docs |
| `docs/repo-structure.md` | This file | Docs |
| `docs/examples.md` | Example workflows | Docs |
| `docs/OPERATING-MODEL.md` | Operating model | Docs |
| `docs/scoring-model.md` | Scoring weights | Docs |
| `docs/LEGACY-SKILLS.md` | Legacy vs pack | Docs |

---

## examples/

Sample output and fixtures.

| Path | Purpose | Type |
|------|---------|------|
| `examples/validated-review-output.json` | Schema-conformant review output | Example |
| `examples/quality-gate-result-sample.json` | Quality gate verdict sample | Example |

---

## scripts/

Validation and utility scripts.

| Path | Purpose | Type |
|------|---------|------|
| `scripts/validate-review-output.sh` | Validate JSON against review-score schema (Unix) | Script |
| `scripts/validate-review-output.ps1` | Same (Windows) | Script |

---

## hooks/

Git hooks.

| Path | Purpose | Type |
|------|---------|------|
| `hooks/pre-push` | Quality gate check before push | Hook |

---

## tests/

Test suite.

| Path | Purpose | Type |
|------|---------|------|
| `tests/run-all.js` | Runs all tests | Test |

---

## Legacy / Other Folders

The repo contains additional folders (e.g., `security-review/`, `networking-review/`, `nist-compliance-evaluator/`, `aws-federal-grade-checklist/`) that may be legacy or referenced by the pack. See `docs/LEGACY-SKILLS.md` for mapping.
