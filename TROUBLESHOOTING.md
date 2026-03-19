# Troubleshooting

Common issues and solutions for the AWS Well-Architected Pack.

---

## Installation

### `bun install` or `npm install` fails in `.opencode/`

**Cause**: Missing Node.js/Bun or wrong directory.

**Fix**:
```bash
cd .opencode
bun install   # or: npm install
```

If Bun isn't installed: `npm install -g bun` or use `npm install` instead.

---

### Install script copies but OpenCode doesn't see commands

**Cause**: Config path not set. OpenCode looks for `opencode.json` at repo root or `OPENCODE_CONFIG`.

**Fix**:
- Ensure `opencode.json` exists at repo root (copy from `.opencode/opencode.json`), or
- Set `OPENCODE_CONFIG=.opencode/opencode.json` before running `opencode`

---

## Plugin

### Agent refuses to read `.env` — "[AWS Pack] Do not read .env..."

**Cause**: Plugin is working. This is intentional.

**Fix**: None. The plugin blocks reading `.env`, secrets, `.pem`, `.key` for security.

---

### Push blocked: "quality gate not passed"

**Cause**: `AWS_PACK_ENFORCE_QUALITY_GATE=true` and `.opencode/quality-gate-result.json` is missing or verdict is NOT_READY.

**Fix**:
1. Run `/quality-gate` in OpenCode before pushing
2. Or set `AWS_PACK_ENFORCE_QUALITY_GATE=false` to skip enforcement

---

### Plugin too strict / want to relax hooks

**Cause**: Default `AWS_PACK_HOOK_PROFILE=strict` enables all hooks.

**Fix**:
```bash
# Only block dangerous commands
export AWS_PACK_HOOK_PROFILE=minimal

# Block .env + push, but no secret/file logging
export AWS_PACK_HOOK_PROFILE=standard
```

---

## Schema validation

### `npx` or `ajv` not found

**Cause**: Node.js not in PATH or not installed.

**Fix**:
- Install Node.js (LTS) from nodejs.org
- Ensure `npx` is available: `node -v` and `npx -v`

---

### Validation fails: "additional properties" or "required"

**Cause**: Your JSON doesn't match `schemas/review-score.schema.json`.

**Fix**: Compare with `examples/validated-review-output.json`. Ensure:
- `letter_grade` is one of: A, B+, B, C, D, F
- `production_readiness` is one of: READY, CONDITIONAL, NOT_READY
- `findings[].severity` is one of: CRITICAL, HIGH, MEDIUM, LOW

---

## Tests

### `node tests/run-all.js` fails with "node not found"

**Cause**: Node.js not in PATH.

**Fix**: Install Node.js and ensure it's in your PATH.

---

### Schema validation test skipped

**Cause**: `npx` not in PATH. The test skips gracefully.

**Fix**: Install Node.js. Other tests (review-score logic, install scripts) still run.

---

## Cursor

### Cursor doesn't use AWS pack rules

**Cause**: Rules are in `.cursor/rules/` with `alwaysApply: false` and `globs` — they trigger only for matching files.

**Fix**: Open a file matching the globs (e.g. `*.tf`, `*.yaml`, `.github/**`) or add the rule to a broader scope in `.cursor/rules/aws-well-architected.md`.

---

## Commands

### `/repo-assess` produces no output

**Cause**: Agent may need more context or the repo has no IaC/CI files.

**Fix**:
- Ensure the repo has Terraform, CloudFormation, CI configs, or Kubernetes manifests
- Run in a session with repo context loaded
- Check `skills/aws-well-architected-pack/routing/trigger-matrix.yaml` for what triggers modules

---

### `/quality-gate` doesn't write `.opencode/quality-gate-result.json`

**Cause**: Agent may not have completed or encountered an error.

**Fix**: Check session output for errors. Ensure plugin deps are installed (`cd .opencode && bun install`).
