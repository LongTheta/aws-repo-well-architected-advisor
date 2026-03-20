# Ravvix Integration (Provisional)

**Status**: No Ravvix-specific integration is present in this repository.

---

## Current Status

- No Ravvix config files
- No Ravvix examples or conventions
- No verified Ravvix behavior

All guidance below is **provisional** and based on assumptions about how Ravvix may work with prompt-based tools. It has not been tested.

---

## Unverified Assumptions

- Ravvix can load project-level instructions from a markdown file
- Ravvix supports rules or policies similar to Cursor
- Ravvix can invoke workflows via natural language or commands
- Ravvix may support skill-like modules

---

## How to Adapt This Repo for Ravvix (Conceptual)

If Ravvix supports project instructions:

1. **Prompt / instructions file**
   - Create a root-level prompt file (e.g., `RAVVIX.md` or `PROMPT.md`) that summarizes:
     - Repo purpose: AWS Well-Architected advisor
     - Evidence model: observed, inferred, missing, contradictory
     - Commands: /repo-assess, /federal-checklist, /design-and-implement, etc.
     - Output: per `schemas/review-score.schema.json`
   - Or mirror `.claude/CLAUDE.md` if Ravvix uses a similar path.

2. **Rules / policy**
   - If Ravvix has a rules system, mirror `.cursor/rules/aws-well-architected.md`:
     - Evidence tags, never assume compliance
     - Review flow: repo-discovery → architecture-inference → security → scoring

3. **Docs**
   - Copy or link: `docs/commands.md`, `docs/evidence-model.md`, `docs/federal-mode.md`
   - Ensure the model can reference these for detailed behavior

4. **Examples**
   - Provide `examples/validated-review-output.json` as a sample output format
   - Use `docs/examples.md` for workflow examples

---

## Files to Mirror for Ravvix

| File | Purpose |
|------|---------|
| `docs/core-ai-guidance.md` | **Canonical** AI guidance (single source of truth) |
| `docs/AI-CLOUD-ARCHITECT-AGENT-NIST-DOD.md` | Full agent spec (NIST/DoD) |
| `AGENTS.md` | OpenCode agent definitions |
| `.claude/CLAUDE.md` | Claude Code instructions (adapt for Ravvix) |
| `.cursor/rules/aws-well-architected.md` | Cursor rules (if Ravvix supports) |
| `skills/aws-well-architected-pack/SKILL.md` | Core skill |
| `schemas/review-score.schema.json` | Output schema |
| `docs/commands.md` | Command reference |
| `examples/validated-review-output.json` | Sample output |

**Note:** No Ravvix-specific instruction files exist. Do not invent them. Use `docs/core-ai-guidance.md` as the base and adapt per Ravvix conventions once verified.

---

## Next Steps (If You Use Ravvix)

1. Verify Ravvix’s project instruction format and paths
2. Create a Ravvix-specific prompt file and test
3. Document verified behavior in this file and remove "provisional" labels
