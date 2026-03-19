# Installation

## Install Script (Recommended)

Use the install script to copy the AWS pack into the current directory or another repo:

```bash
# Unix/macOS
./install.sh [--target opencode|cursor] [--dest DIR] [--hooks]

# Windows PowerShell
.\install.ps1 [-Target opencode|cursor] [-Dest DIR] [-Hooks]
```

- `--target opencode` (default): OpenCode config, skills, schemas
- `--target cursor`: Same + `.cursor/rules/aws-well-architected.md`
- `--target claude`: Same + `.claude/` (CLAUDE.md, agents)
- `--dest DIR`: Destination (default: current directory)
- `--hooks`: Install pre-push hook for quality gate

## Use This Repo Directly

1. Clone the repo.
2. Ensure OpenCode is installed.
3. Set config:
   - Copy `.opencode/opencode.json` to `opencode.json` at repo root, or
   - Set `OPENCODE_CONFIG=.opencode/opencode.json`
4. Install plugin deps: `cd .opencode && bun install`
5. Run: `opencode run "/repo-assess"` or use commands in TUI.

## Copy .opencode Assets Into Another Repo

1. Copy `.opencode/` into your repo's `.opencode/` (merge with existing).
2. Copy `skills/aws-well-architected-pack/` into your repo's `skills/`.
3. Copy `schemas/` into your repo.
4. Copy `RULES.md`, `docs/OPERATING-MODEL.md` into instructions paths.
5. Update `opencode.json` (or your config) to reference:
   - `instructions`: add `skills/aws-well-architected-pack/SKILL.md`, `RULES.md`
   - `plugin`: add `.opencode/plugins/aws-well-architected-enforcement.ts`
   - `command`: merge or replace with commands from `.opencode/opencode.json`

## Use Skills Independently

- Copy `skills/aws-well-architected-pack/` to your `skills/` directory.
- Reference `SKILL.md` in instructions.
- Invoke via natural language: "Run AWS Well-Architected review" or custom commands that point to the skill.

## Pre-Push Governance

1. Copy `hooks/pre-push` to `.git/hooks/pre-push`
2. `chmod +x .git/hooks/pre-push`
3. To enforce: `export AWS_PACK_ENFORCE_QUALITY_GATE=true`
4. Run `/quality-gate` before push; it writes `.opencode/quality-gate-result.json`

## Plugin Verification

Confirm the plugin loads and hooks run:

1. **Install deps**: `cd .opencode && bun install`
2. **Start OpenCode**: `opencode` (or use TUI)
3. **Test .env block**: Ask the agent to read `.env` — it should refuse with `[AWS Pack] Do not read .env...`
4. **Test quality gate block** (optional): Set `AWS_PACK_ENFORCE_QUALITY_GATE=true`, run a session, try `git push` without running `/quality-gate` first — push should be blocked
5. **Test review-score tool**: Ask "Compute review score for security:7, reliability:6, cost_optimization:5" — agent should call `review_score` and return weighted score and letter grade

## Schema Validation

Validate review output against the schema:

```bash
# Unix/macOS
./scripts/validate-review-output.sh [path-to.json]

# Windows PowerShell
.\scripts\validate-review-output.ps1 [path-to.json]
```

Default path: `examples/validated-review-output.json`. Requires `npx` (Node.js) and `ajv-cli` (installed via npx).

## Running Tests

```bash
npm test
# or
node tests/run-all.js
```

Requires Node.js. Tests: schema validation, review-score logic, install script presence.

## Future Plugin/Tool Installation

- **Plugin from npm**: Add to `plugin` array in config: `"@org/aws-well-architected-plugin"`.
- **Local plugin**: Place in `.opencode/plugins/`; loaded automatically.
- **Tools**: Implement per `.opencode/tools/*.md` specs; add to plugin or `.opencode/tools/`.
