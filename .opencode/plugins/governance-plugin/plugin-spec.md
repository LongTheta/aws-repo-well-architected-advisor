# Governance Plugin — Plugin Spec

## Contract

The governance plugin subscribes to OpenCode events and enforces rules via hooks.

## Hooks Implemented

| Hook | Purpose |
|------|---------|
| `tool.execute.before` | Block unsafe reads (.env, secrets); block push without quality gate when enforced |
| `tool.execute.after` | Track file edits; track MCP usage |
| `file.edited` | Flag infra edits for doc-sync |
| `message.updated` | Detect potential secrets in content |
| `event` (session.created, session.deleted) | Manage session state |

## Behavior

### Block (throws; operation fails)

- Read of `.env`, `secrets`, `.pem`, `.key`
- `git push` when `AWS_PACK_ENFORCE_QUALITY_GATE=true` and quality gate not passed
- Dangerous shell commands (`rm -rf /`, fork bomb)

### Warn (log; operation continues)

- Infra file edited → log "Run /doc-sync"
- Potential secrets in message content → log warning
- MCP usage → track for audit

### Inform (log; no user action)

- Session state changes
- File modification tracking

## Configuration

| Env Var | Effect |
|---------|--------|
| `AWS_PACK_ENFORCE_QUALITY_GATE=true` | Block push without quality gate |
| (default) | Push not blocked; quality gate advisory only |

## Quality Gate State

- **Passed**: Session state `qualityGatePassed=true` (set by tool or /quality-gate)
- **File-based**: `.opencode/quality-gate-result.json` with `verdict` (READY/CONDITIONAL/NOT_READY)
- **Pre-push hook**: `hooks/pre-push` checks file when enforced
