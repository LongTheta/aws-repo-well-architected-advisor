# Packaging Strategy

## Run in Repo

Use this repo as the working directory. OpenCode loads config from project root or `.opencode/`. All commands, skills, plugins available.

## Install as Pack

**Option A — Copy assets**:
- Copy `.opencode/` into target repo
- Copy `skills/aws-well-architected-pack/`
- Copy `schemas/`
- Merge instructions and commands into target's config

**Option B — Submodule or subtree**:
- Add this repo as submodule
- Symlink or copy `.opencode/`, `skills/`, `schemas/` into target

**Option C — Future npm package**:
- Publish plugin as `@org/aws-well-architected-opencode`
- Publish skills as installable pack
- Config: `"plugin": ["@org/aws-well-architected-opencode"]`

## Plugin vs Full Config

| Mode | What to Copy | Use Case |
|------|--------------|----------|
| **Plugin only** | `.opencode/plugins/aws-well-architected-enforcement.ts` | Add enforcement to existing OpenCode setup |
| **Full config** | `.opencode/` + `skills/` + `schemas/` + `RULES.md` | Full pack with commands, agents, skills |

## Skills Independence

Skills in `skills/aws-well-architected-pack/` can be used without the plugin. Add `skills/aws-well-architected-pack/SKILL.md` to instructions. Invoke via natural language or custom commands.
