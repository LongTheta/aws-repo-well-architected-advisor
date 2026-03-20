# Using the Advisor in Claude Code

How to use the AWS Repo Well-Architected Advisor with Claude Code.

---

## CLAUDE.md

The repo uses `.claude/CLAUDE.md` (not a root `CLAUDE.md`). Claude Code loads this when the repo is the project context. It aligns with `docs/core-ai-guidance.md` (canonical AI guidance).

### Current Content

- Reference `skills/aws-well-architected-pack/SKILL.md`
- Commands: full assessment, federal compliance, quality gate
- Evidence model: observed, inferred, missing, contradictory
- Output per `schemas/review-score.schema.json`

---

## SKILL.md Usage

Claude should reference `skills/aws-well-architected-pack/SKILL.md` for the review workflow. The skill describes:

- Conductor pattern
- 10 specialist modules (repo-discovery, architecture-inference, security, networking, etc.)
- Evidence tags and confidence levels
- Scoring and production readiness

---

## How to Point Claude at the Repo

1. Open Claude Code.
2. Open the `aws-repo-well-architected-advisor` repo as the project (or a repo with the advisor installed via `install.sh --target claude`).
3. Claude will load `.claude/CLAUDE.md` as project instructions.

---

## Repo Memory / Instructions

Claude Code uses project-level instructions from `.claude/CLAUDE.md`. This repo does not use a separate memory store. All guidance is in:

- `.claude/CLAUDE.md`
- Referenced files (SKILL.md, schemas, docs)

---

## How to Invoke Main Workflows

Ask Claude in natural language:

- "Run full AWS Well-Architected assessment"
- "Run federal compliance review"
- "Run quality gate and produce verdict"
- "Review this Terraform for Well-Architected alignment"
- "Design infrastructure from requirements and generate Terraform"

Claude will follow the skill pack and produce output per `schemas/review-score.schema.json`.

---

## Example Session

**User:** Run full AWS Well-Architected assessment on this repo.

**Claude:** I'll run the assessment per the AWS Well-Architected Pack. [Proceeds with repo-discovery, architecture-inference, security-review, networking-review, observability-review, scoring.] Here's the report: [Executive summary, scorecard, findings, production readiness verdict.]

**User:** Run federal compliance review.

**Claude:** I'll run the federal-grade review: evidence extraction → control-family mapping (NIST AC, IA, SC, AU, SI, CM, IR) → readiness report. [Outputs control mapping, NIST_ALIGNMENT, DOD_ALIGNMENT, allowed-claims language only.]

---

## Installing into Another Repo

```bash
./install.sh --target claude --dest /path/to/your-repo
```

This copies `.claude/` (CLAUDE.md, agents) into the target repo.
