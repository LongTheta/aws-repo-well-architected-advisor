# Migration: Documentation-First to Executable

## How This Repo Differs From Broad Agent Packs

- **Focused**: Repository architecture review, solution discovery, platform design, federal compliance, GitOps audit. Not a generic AI assistant.
- **Evidence-first**: All findings require evidence tags. No assumed compliance.
- **Command-driven**: 10 commands with defined agents, skills, output schemas.
- **Governance**: Plugin enforces quality gate, blocks unsafe reads, flags secrets.
- **Scoring engine**: First-class; all review commands produce schema-valid output.

## Moving From Documentation-First to Executable

### Before (Doc-First)

- Skills and rules documented but not wired to commands.
- No agent assignment.
- No output schema enforcement.
- No plugin enforcement.
- Manual invocation via prose.

### After (Executable)

1. **Config as control plane**: `.opencode/opencode.json` defines commands, agents, plugins.
2. **Commands map to agents**: Each command has `agent` field.
3. **Commands map to skills**: See `docs/command-to-skill-mapping.md`.
4. **Output schemas**: Commands reference `schemas/review-score.schema.json`.
5. **Plugin enforces**: Blocks .env read, push without gate (when enforced).
6. **Structured output**: Reports conform to schema.

### Migration Steps

1. Add `.opencode/opencode.json` (or merge into existing).
2. Add plugin: `.opencode/plugins/aws-well-architected-enforcement.ts`
3. Add commands to config.
4. Add agents to config.
5. Add instructions: `skills/aws-well-architected-pack/SKILL.md`, `RULES.md`
6. Install pre-push hook if desired.
7. Run `/repo-assess` to validate.

## Extending Safely

- **Commands**: Add to `command` in config; add lifecycle doc in `.opencode/commands/`.
- **Agents**: Add to `agent` in config.
- **Skills**: Add modules to `skills/aws-well-architected-pack/modules/`; update routing.
- **Plugin rules**: Edit `plugins/governance-plugin/rules-map.md` and plugin code.
- **Schemas**: Add to `schemas/`; reference in commands.
