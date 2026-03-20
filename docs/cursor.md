# Using the Advisor in Cursor

How to use the AWS Repo Well-Architected Advisor with Cursor.

---

## How to Open the Repo in Cursor

1. Open Cursor.
2. File → Open Folder → select `aws-repo-well-architected-advisor` (or your repo with the advisor installed).

---

## Project Rules Configuration

The repo includes `.cursor/rules/aws-well-architected.md`. Cursor loads rules from `.cursor/rules/` automatically.

### Rule Files

| File | Purpose |
|------|---------|
| `.cursor/rules/aws-well-architected.md` | AWS Well-Architected review (applies to IaC/CI files) |
| `.cursor/rules/advisor-repo.md` | Advisor repo context (applies when editing docs, schemas, config) |

Both align with `docs/core-ai-guidance.md` (canonical AI guidance).

### Rule Content (Summary)

- Use `skills/aws-well-architected-pack` for AWS architecture review
- Evidence tags: Observed, Inferred, Missing Evidence
- Never assume compliance without evidence
- Run repo-discovery → architecture-inference → security-review → scoring
- Output per `schemas/review-score.schema.json`
- Design-and-implement flow: `/design-and-implement` or stepwise `/solution-discovery` → `/platform-design` → `/scaffold`

### Globs

The rule applies when editing:

- `**/*.tf`, `**/*.tfvars`
- `**/*.yaml`, `**/*.yml`
- `**/Dockerfile`
- `**/.github/**`

`alwaysApply: false` — rule applies when globs match, not globally.

---

## Remote Rule Setup

Cursor can use remote rules. This repo does not ship a remote rule URL. To add one:

1. Host the rule content (e.g., from `.cursor/rules/aws-well-architected.md`) on a URL.
2. Add the URL in Cursor Settings → Rules → Remote rules.

**Recommended**: Use the local `.cursor/rules/` file; it is version-controlled and stays in sync with the repo.

---

## How to Use the Repo Prompt in Chat or Agent Mode

1. Open the repo in Cursor.
2. Open Chat (Cmd/Ctrl+L) or Agent mode.
3. Reference the advisor explicitly:

   - "Run AWS Well-Architected review on this repo"
   - "Run /repo-assess"
   - "Review this Terraform for Well-Architected alignment"
   - "Run federal compliance checklist"

4. The model will use `.cursor/rules/aws-well-architected.md` when editing IaC/CI files. For full context, you can @-mention:
   - `skills/aws-well-architected-pack/SKILL.md`
   - `docs/AI-CLOUD-ARCHITECT-AGENT-NIST-DOD.md`

---

## Example Session

**User:** Run AWS Well-Architected review on this repo.

**Cursor (with rule):** I'll run the review flow: repo-discovery → architecture-inference → security-review → networking-review → observability-review → scoring. [Proceeds to inventory repo, analyze IaC, produce findings, scorecard, verdict.]

**User:** Run /federal-checklist

**Cursor:** I'll run the federal-grade review per AI-CLOUD-ARCHITECT-AGENT-NIST-DOD: discovery → standards mapping (NIST 800-53, 800-37, 800-190, 800-204; DoD Zero Trust, DevSecOps) → control alignment. [Outputs NIST_ALIGNMENT, DOD_ALIGNMENT, control mapping.]

---

## Installing into Another Repo

To add Cursor rules to another repo:

```bash
./install.sh --target cursor --dest /path/to/your-repo
```

This copies `.cursor/rules/aws-well-architected.md` into the target repo.
