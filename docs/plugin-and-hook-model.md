# Plugin and Hook Model

## Plugin

**Location**: `.opencode/plugins/aws-well-architected-enforcement.ts`

**Loaded by**: OpenCode via `plugin` array in config.

**Hooks**:
- `tool.execute.before` — Block .env read, push without quality gate, dangerous commands
- `tool.execute.after` — Track file edits, MCP usage
- `file.edited` — Log doc-sync hint for infra changes
- `message.updated` — Detect potential secrets
- `event` — Session lifecycle (create, delete)

**Config**: `AWS_PACK_ENFORCE_QUALITY_GATE=true` to block push without quality gate.

## Hooks (Git)

**Location**: `hooks/pre-push`

**Install**: `cp hooks/pre-push .git/hooks/pre-push && chmod +x .git/hooks/pre-push`

**Behavior**: When `AWS_PACK_ENFORCE_QUALITY_GATE=true`, checks `.opencode/quality-gate-result.json` for verdict. Blocks push if not READY or CONDITIONAL.

**Quality gate result**: Written by `/quality-gate` command.

## Event Flow

```
User runs /quality-gate
  → Full review
  → Verdict produced
  → .opencode/quality-gate-result.json written

User runs git push
  → Pre-push hook runs
  → Checks quality-gate-result.json
  → If NOT_READY and enforced: exit 1

Plugin tool.execute.before (bash, git push)
  → If quality gate not passed and enforced: throw
```
