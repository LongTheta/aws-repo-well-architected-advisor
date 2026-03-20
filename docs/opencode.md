# Using the Advisor in OpenCode

How to use the AWS Repo Well-Architected Advisor with OpenCode.

---

## How OpenCode Discovers Repo-Level Instructions

OpenCode loads instructions from the config file (`opencode.json` or `.opencode/opencode.json`). In this repo, the `instructions` array includes:

- `docs/AI-CLOUD-ARCHITECT-AGENT.md` — Base agent spec
- `docs/AI-CLOUD-ARCHITECT-AGENT-NIST-DOD.md` — NIST/DoD overlay
- `docs/AI-CLOUD-ARCHITECT-AGENT-V5.md` — v5: full lifecycle, Workload Profile, Service Selection, FinOps (11-step lifecycle)
- `docs/modes.md` — Mode routing
- `skills/aws-well-architected-pack/SKILL.md` — Core skill pack
- `aws-repo-scaffolder/SKILL.md` — IaC generation
- `cloud-architecture-ai-auditor/aws-app-platform-questionnaire.md` — Business requirements
- `cloud-architecture-ai-auditor/infrastructure-governance-questionnaire.md` — Tagging, CIDR, roles
- `RULES.md` — Project rules
- `docs/OPERATING-MODEL.md` — Operating model

These are loaded at session start. The agent uses them for all commands.

---

## AGENTS.md

This repo uses `AGENTS.md` to document OpenCode agents and usage conventions. Agent definitions live in `opencode.json` under the `agent` key. `AGENTS.md` aligns with `docs/core-ai-guidance.md` (canonical AI guidance).

---

## SKILL.md Files

Skills are defined in SKILL.md files:

| Location | Purpose |
|----------|---------|
| `skills/aws-well-architected-pack/SKILL.md` | Conductor; invokes 10 specialist modules |
| `skills/aws-well-architected-pack/modules/*/SKILL.md` | repo-discovery, architecture-inference, security, networking, reliability, devops, finops, observability, compliance |
| `aws-repo-scaffolder/SKILL.md` | Terraform/CDK scaffolding |

The pack is referenced in instructions. Commands invoke agents that follow these skills.

---

## How to Open the Repo in OpenCode

1. Install OpenCode.
2. Open a terminal in the repo root.
3. Run:
   ```bash
   opencode
   ```
   Or open the repo in your editor and use the OpenCode extension/TUI.

4. Ensure config is set:
   - `opencode.json` at repo root, or
   - `OPENCODE_CONFIG=.opencode/opencode.json`

---

## How to Invoke Commands

From the OpenCode TUI or CLI:

```bash
opencode run "/repo-assess"
opencode run "/design-and-implement"
opencode run "/federal-checklist"
```

Or type the command in the TUI prompt.

---

## Example Session

```
$ opencode

> /repo-assess

[Agent: repo-auditor]
Running full repository architecture assessment...
- repo-discovery
- architecture-inference
- security-review
- networking-review
- observability-review
- scoring

[Output]
Executive Summary
...
Weighted score: 6.2
Letter grade: C
Production readiness: CONDITIONAL
Top findings: ...
```

```
> /design-and-implement

[Agent: design-and-implement-conductor]
1. Inventorying repo...
2. Asking requirements (aws-app-platform-questionnaire, infrastructure-governance-questionnaire)...
   - project? my-app
   - environment? dev
   - vpc_cidr? 10.0.0.0/16
   ...
3. Producing target architecture...
4. Generating Terraform/CDK...
[Output: solution brief, architecture, IaC files]
```
