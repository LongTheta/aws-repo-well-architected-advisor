# Current State Assessment

## 1. What Already Exists and Is Good

| Asset | Quality | Notes |
|-------|---------|-------|
| **skills/aws-well-architected-pack/** | Strong | Clean 10-module structure, conductor SKILL, trigger matrix, scoring model, evidence/severity references |
| **Scoring model** | Good | Weighted categories, letter grade, production readiness rules |
| **review-score.schema.json** | Good | Structured output schema |
| **Evidence model** | Good | Observed/Inferred/Missing, confidence levels |
| **Severity model** | Good | CRITICAL/HIGH/MEDIUM/LOW, production blocking rules |
| **opencode.json** | Partial | Commands exist but use AWS-specific names; missing /repo-assess, /solution-discovery, etc. |
| **.opencode/plugins/aws-well-architected-enforcement.ts** | Good | Real plugin: blocks .env read, push without quality gate, secrets detection |
| **hooks/pre-push** | Good | Git hook stub for quality gate |
| **RULES.md** | Good | Evidence rules, gating rules |
| **Legacy skills** | Mixed | cloud-architecture-ai-auditor, security-review, etc. — rich content but scattered |

## 2. What Is Documentation-Only and Not Executable

- **skill-trigger-matrix.yaml** (root) — Not wired to opencode.json; duplicate of pack's routing
- **review-order.md, review-mode-definitions.md** — Docs only; no runtime binding
- **architecture-decision-engine, aws-architecture-pattern-advisor** — Standalone; not in command flow
- **aws-federal-grade-checklist** — Separate skill; not integrated into /federal-checklist command
- **aws-repo-scaffolder** — Separate; no command mapping
- **Command-to-skill mapping** — Implicit in templates; no explicit routing doc
- **Output schemas** — Schema exists but commands don't reference it

## 3. What Is Missing Compared to a Mature OpenCode Pack

- **.opencode/opencode.json** — Config is at repo root; OpenCode expects .opencode/ or project root
- **Agents** — Only aws-reviewer, aws-security-auditor; missing solution-architect, repo-auditor, federal-security-reviewer, gitops-reviewer, cloud-platform-reviewer, documentation-writer
- **Commands** — Missing /repo-assess, /solution-discovery, /platform-design, /federal-checklist, /gitops-audit, /quality-gate, /doc-sync (have /docs-sync)
- **Governance plugin spec** — No event-model, rules-map, plugin-spec
- **Native tool specs** — No tool design docs
- **Command lifecycle** — No intent, required context, steps, output contract per command
- **Skill orchestration docs** — No command-to-skill-mapping.md, runtime-orchestration.md
- **Routing matrix** — No command-routing.schema.json, routing-matrix.md
- **INSTALL.md, MIGRATION.md, llms.txt** — Missing
- **docs/plugin-and-hook-model.md, packaging-strategy.md** — Missing
- **Consolidated scoring** — scoring-model in pack; need docs/scoring-model.md, docs/report-template.md at repo level
- **Cost Awareness** — Scoring has Cost Optimization; user asked for "Cost Awareness" — align

## 4. Where Runtime Behavior Is Unclear or Not Wired

- **Command → Agent** — opencode.json commands have no `agent` field
- **Command → Output schema** — No schema reference in commands
- **Plugin → Quality gate** — Plugin blocks push but quality gate state is session-only; no file-based result
- **Pre-push hook** — Looks for .opencode/quality-gate-result.json; nothing creates it
- **Skill pack vs legacy skills** — Two parallel worlds; legacy skills not routed by commands

## 5. What Should Be Preserved vs Refactored

| Preserve | Refactor |
|----------|----------|
| skills/aws-well-architected-pack/* | Consolidate opencode.json into .opencode/ |
| Evidence model, severity model | Add Cost Awareness alias; align category names |
| Plugin enforcement logic | Rename to governance-plugin; add spec docs |
| RULES.md | Keep; add to instructions |
| review-score.schema.json | Move to schemas/; ensure all commands reference |
| 10-module skill structure | Map commands to skill graphs explicitly |
| Production readiness rules | Wire to /quality-gate |

## Gap Analysis Summary

1. **Control plane** — opencode.json at root; needs .opencode/ structure; commands need agent, schema, blocking conditions
2. **Agent coverage** — 2 agents → 7 agents
3. **Command coverage** — 8 commands → 10 commands with full lifecycle
4. **Governance** — Plugin exists but no spec; need event-model, rules-map
5. **Tools** — No tool design docs
6. **Orchestration** — No explicit skill graphs per command
7. **Packaging** — No INSTALL, MIGRATION, llms.txt
8. **Scoring** — Good in pack; need repo-level docs and schema alignment

## Proposed Implementation Plan

1. **Phase 2** — Create .opencode/opencode.json with 10 commands, 7 agents, schema refs
2. **Phase 3** — Create governance-plugin/ with README, plugin-spec, event-model, rules-map
3. **Phase 4** — Create .opencode/tools/ with 5 tool spec docs
4. **Phase 5** — Add command lifecycle (intent, context, steps, output) to each command
5. **Phase 6** — Create docs/command-to-skill-mapping.md, runtime-orchestration.md, routing-matrix
6. **Phase 7** — Create INSTALL.md, MIGRATION.md, llms.txt, plugin-and-hook-model, packaging-strategy
7. **Phase 8** — Consolidate scoring: docs/scoring-model.md, report-template.md, schemas/, examples/
8. **Phase 9** — Clean up: remove redundant docs, consolidate, improve README
