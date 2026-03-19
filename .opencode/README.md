# .opencode — Control Plane

This directory is the OpenCode control plane for the AWS Well-Architected Pack.

## Structure

```
.opencode/
├── opencode.json          # Primary config: commands, agents, plugins
├── README.md              # This file
├── MIGRATION.md           # Migration from doc-first to executable
├── package.json           # Plugin dependencies
├── plugins/
│   ├── aws-well-architected-enforcement.ts
│   └── governance-plugin/   # Specs (see governance-plugin/README.md)
└── tools/                 # Native tool specs (see tools/README.md)
```

## Config Usage

- **Run in repo**: OpenCode loads `opencode.json` from project root. Copy `.opencode/opencode.json` to `opencode.json` at repo root, or set `OPENCODE_CONFIG=.opencode/opencode.json`.
- **Install as pack**: Copy `.opencode/` into target repo's `.opencode/` or merge into existing config.

## Commands

| Command | Agent | Purpose |
|---------|-------|---------|
| /repo-assess | repo-auditor | Full repository architecture assessment |
| /solution-discovery | product-manager-discovery | Requirements discovery |
| /platform-design | cloud-platform-reviewer | Platform design and reference architecture |
| /federal-checklist | federal-security-reviewer | Federal compliance review |
| /gitops-audit | gitops-reviewer | GitOps and DevSecOps audit |
| /quality-gate | repo-auditor | Production readiness gate |
| /doc-sync | documentation-writer | Sync architecture docs |
| /verify | repo-auditor | Verify findings and evidence |
| /checkpoint | repo-auditor | Checkpoint review state |
| /orchestrate | repo-auditor | Orchestrate multi-phase review |

## Agents

| Agent | Use Case |
|-------|----------|
| solution-architect | AWS design decisions |
| product-manager-discovery | Requirements discovery |
| repo-auditor | Architecture review, scoring, verification |
| federal-security-reviewer | NIST, FedRAMP |
| gitops-reviewer | CI/CD, GitOps |
| cloud-platform-reviewer | Platform design |
| documentation-writer | Doc sync |

## Plugins

- **aws-well-architected-enforcement**: Blocks .env read, push without quality gate, secrets; logs infra edits.
- **governance-plugin**: Specs for event model, rules map. See `plugins/governance-plugin/`.
