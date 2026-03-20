# Contributing

How to contribute to the AWS Repo Well-Architected Advisor.

---

## Development Setup

1. Clone the repo.
2. Run `npm install` and `cd .opencode && bun install` (or `npm install`).
3. Run `npm test` to verify tests pass.
4. Run `npm run validate` or `./scripts/validate-review-output.sh examples/validated-review-output.json` to verify schema.

---

## What to Contribute

- **Bug fixes**: Schema errors, plugin issues, install script bugs
- **Documentation**: Clarify commands, modes, evidence model, federal mode
- **New skills**: Specialist modules for new review areas
- **Schema extensions**: New fields with backward compatibility where possible
- **Examples**: Additional sample outputs or workflows

---

## How to Add a New Skill

1. Create `skills/<skill-name>/SKILL.md` with frontmatter and sections (When to Use, Inputs, Outputs, Rules).
2. Add to `opencode.json` instructions.
3. Create or extend an agent to use the skill.
4. Document in `docs/commands.md` if a command invokes it.
5. See [docs/development.md](docs/development.md).

---

## How to Add a New Command

1. Edit `.opencode/opencode.json` and `opencode.json` with the new command and agent.
2. Add `.opencode/commands/<command>.md` (optional).
3. Update `schemas/command-routing.schema.json` if used.
4. Document in `docs/commands.md`.
5. See [docs/development.md](docs/development.md).

---

## How to Update Schemas

1. Edit the schema file.
2. Update `examples/validated-review-output.json` (or create a new example) to match.
3. Run `npm run validate` or `./scripts/validate-review-output.sh` to verify.
4. Update docs that reference the schema.

---

## Keeping README and Docs Synchronized

When adding features:

- Update `README.md` (commands table, capabilities, key files)
- Update `docs/commands.md` (new commands)
- Update `docs/modes.md` (new modes)
- Update `docs/repo-structure.md` (new folders/files)
- Update `AGENTS.md` (new agents)

---

## AI Guidance

- **Canonical source**: `docs/core-ai-guidance.md`. When changing AI instructions, update it first, then sync AGENTS.md, .claude/CLAUDE.md, .cursor/rules/aws-well-architected.md.

## Evidence Model and Federal Mode

- **Never** add claims of compliance, certification, or FedRAMP authorization.
- **Always** use evidence tags (observed, inferred, missing, contradictory, unverifiable) on findings.
- **Always** use allowed claims in federal mode: "aligned with", "supports", "lacks evidence for".

---

## Tests

```bash
npm test
```

Ensure tests pass before submitting. If you add new functionality, add tests where appropriate.

---

## Pull Request Process

1. Fork the repo.
2. Create a branch.
3. Make changes; run tests; update docs.
4. Submit a pull request with a clear description.
5. Maintainers will review and may request changes.
