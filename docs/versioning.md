# Versioning Policy

## Authoritative Version

**v5 is authoritative.** All agent behavior, schemas, and output contracts are defined by:

- `docs/AI-CLOUD-ARCHITECT-AGENT-V5.md`
- `schemas/*.schema.json`
- `docs/workload-type-profiles.md`

## Future Changes

Any future changes to the agent, output format, or behavior **require**:

1. **Schema updates** — Modify the relevant `schemas/*.schema.json` files
2. **Test updates** — Update `tests/` to validate new or changed behavior

Do not introduce breaking changes without corresponding schema and test updates.

## Archived Versions

Previous or experimental versions are stored in `docs/archive/` for reference only. They are not authoritative.
