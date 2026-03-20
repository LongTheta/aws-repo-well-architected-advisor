# Installation

Step-by-step installation for the AWS Repo Well-Architected Advisor.

---

## Prerequisites

- **Node.js** 18+ (for tests, schema validation)
- **OpenCode** (for full command set and plugin)
- **Bun** or **npm** (for plugin dependencies)

---

## Option 1: Use This Repo Directly

1. Clone the repo:
   ```bash
   git clone https://github.com/LongTheta/aws-repo-well-architected-advisor.git
   cd aws-repo-well-architected-advisor
   ```

2. Install OpenCode (if not already installed). See [OpenCode docs](https://github.com/opencode-ai/opencode) for your platform.

3. Set config:
   - Copy `.opencode/opencode.json` to `opencode.json` at repo root, **or**
   - Set `OPENCODE_CONFIG=.opencode/opencode.json`

4. Install plugin dependencies:
   ```bash
   cd .opencode && bun install
   # or: npm install
   ```

5. Run a command:
   ```bash
   opencode run "/repo-assess"
   ```

---

## Option 2: Install Into Another Repo

Use the install script to copy the advisor into a target repo.

### Unix / macOS

```bash
# From the advisor repo
./install.sh [--target opencode|cursor|claude] [--dest DIR] [--hooks]
```

### Windows PowerShell

```powershell
.\install.ps1 [-Target opencode|cursor|claude] [-Dest DIR] [-Hooks]
```

### Flags

| Flag | Values | Default | Description |
|------|--------|---------|-------------|
| `--target` / `-Target` | opencode, cursor, claude | opencode | Target harness |
| `--dest` / `-Dest` | Path | `.` | Destination directory |
| `--hooks` / `-Hooks` | — | false | Install pre-push quality gate hook |

### Examples

```bash
# Install for OpenCode in current directory
./install.sh

# Install into another repo
./install.sh --dest /path/to/your-repo

# Add Cursor rules
./install.sh --target cursor --dest /path/to/repo

# Add Claude Code config
./install.sh --target claude --dest /path/to/repo

# Install with pre-push hook
./install.sh --dest /path/to/repo --hooks
```

### What Gets Installed

| Target | Contents |
|--------|----------|
| opencode | `.opencode/`, `skills/`, `schemas/`, `RULES.md`, `docs/` |
| cursor | Same + `.cursor/rules/aws-well-architected.md` |
| claude | Same + `.claude/` (CLAUDE.md, agents) |

---

## Option 3: Pre-Push Quality Gate

To block pushes when the quality gate has not passed:

1. Copy the hook:
   ```bash
   cp hooks/pre-push .git/hooks/pre-push
   chmod +x .git/hooks/pre-push
   ```

2. Enable enforcement:
   ```bash
   export AWS_PACK_ENFORCE_QUALITY_GATE=true
   ```

3. Run `/quality-gate` before pushing. Verdict READY or CONDITIONAL allows push.

---

## Plugin Verification

Confirm the plugin loads and hooks work:

1. **Install deps**: `cd .opencode && bun install`
2. **Start OpenCode**: `opencode` (or use TUI)
3. **Test .env block**: Ask the agent to read `.env` — it should refuse with `[AWS Pack] Do not read .env...`
4. **Test quality gate block** (optional): Set `AWS_PACK_ENFORCE_QUALITY_GATE=true`, try `git push` without running `/quality-gate` first — push should be blocked
5. **Test review-score tool**: Ask "Compute review score for security:7, reliability:6, cost_optimization:5" — agent should return weighted score and letter grade

---

## Schema Validation

Validate review output against the schema:

```bash
# Unix/macOS
./scripts/validate-review-output.sh [path-to.json]

# Windows PowerShell
.\scripts\validate-review-output.ps1 [path-to.json]
```

Default path: `examples/validated-review-output.json`. Requires Node.js and `npx`.

---

## Running Tests

```bash
npm test
# or
node tests/run-all.js
```

Tests: schema validation, review-score logic, install script presence. Requires Node.js.
