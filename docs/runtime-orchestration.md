# Runtime Orchestration

How commands invoke skills and produce outputs.

## Execution Model

1. **Command invoked** — User runs e.g. `/repo-assess`
2. **Agent selected** — From command config (e.g. repo-auditor)
3. **Skill graph resolved** — From command-to-skill-mapping
4. **Modules run in order** — Each module produces findings/scores
5. **Aggregation** — Deduplicate, preserve severity, merge evidence
6. **Scoring** — review-score tool or equivalent
7. **Report** — Fill report-template, validate against schema

## State Between Phases

- **Session state**: qualityGatePassed, filesModified, infraFilesEdited, mcpCalls
- **Checkpoint**: /checkpoint writes summary for resume
- **Quality gate file**: .opencode/quality-gate-result.json

## Blocking Conditions

| Command | Blocks When |
|---------|-------------|
| /federal-checklist | Missing evidence on critical control |
| /quality-gate | NOT_READY + AWS_PACK_ENFORCE_QUALITY_GATE=true (blocks push) |
| /verify | Findings without evidence tags |

## Output Flow

```
Modules → findings[] → aggregate → score → report
                              ↓
                    review-score.schema.json
```

## Plugin Integration

- **tool.execute.before**: Block .env read, push without gate
- **tool.execute.after**: Track edits, MCP usage
- **file.edited**: Log doc-sync hint for infra changes
