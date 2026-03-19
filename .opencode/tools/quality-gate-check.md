# quality-gate-check — Tool Spec

## Purpose

Check if quality gate has passed for the current session or from file.

## Inputs

| Name | Type | Required | Description |
|------|------|----------|-------------|
| session_id | string | No | Session ID. If omitted, check file-based result. |
| source | string | No | "session" | "file". Default: try file, then session. |

## Outputs

| Name | Type | Description |
|------|------|-------------|
| passed | boolean | true if READY or CONDITIONAL |
| verdict | string | READY | CONDITIONAL | NOT_READY |
| message | string | Human-readable status |
| source | string | session | file | none |

## When Commands Call It

- Pre-push hook — before allowing git push
- /quality-gate — after producing verdict, write to file
- tool.execute.before (bash, git push) — plugin checks before push

## Failure Cases

- No session and no file → passed false, source "none"
- File malformed → passed false, message "Invalid quality gate result"

## Schema Reference

`.opencode/quality-gate-result.json`:

```json
{
  "verdict": "READY | CONDITIONAL | NOT_READY",
  "timestamp": "ISO8601",
  "weighted_score": number,
  "letter_grade": string
}
```

## Example Usage

```json
Input:  { "source": "file" }
Output: { "passed": true, "verdict": "CONDITIONAL", "message": "Quality gate passed (CONDITIONAL)", "source": "file" }
```
