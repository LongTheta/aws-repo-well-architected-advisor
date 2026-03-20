# AWS Repo Well-Architected Advisor

Evidence-based repository architecture reviews for AWS Well-Architected pillars, NIST/DoD federal compliance, and GitOps. Runs on OpenCode, Cursor, and Claude Code.

---

## Summary

This repo is an AI-powered advisor that evaluates repositories against AWS Well-Architected pillars and federal standards (NIST SP 800-series, DoD Zero Trust, DoD DevSecOps). It produces structured, evidence-based findings with production-readiness verdicts. It never assumes compliance from code alone; every finding is tagged with evidence type and confidence.

---

## What the Repo Does

1. **Assesses** repositories (IaC, CI/CD, Kubernetes) for Well-Architected alignment
2. **Discovers** business and infrastructure requirements via questionnaires
3. **Designs** target architectures from requirements
4. **Scaffolds** Terraform, CDK, or CloudFormation with security defaults
5. **Reviews** for federal alignment (NIST 800-53, 800-37, 800-190, 800-204; DoD Zero Trust, DevSecOps)
6. **Enforces** quality gates (READY / CONDITIONAL / NOT_READY) and can block `git push` when configured

---

## Key Capabilities

| Capability | Description |
|------------|-------------|
| Repository assessment | Full architecture review: IaC (Terraform, CDK, CloudFormation), CI/CD, Kubernetes. Weighted scorecard, findings, production readiness. |
| Solution discovery | Requirements: users, traffic, budget, compliance; tagging (project, owner, cost_center); CIDR; IAM roles. Produces solution brief with `infrastructure_config`. |
| Platform design | Reference architecture from discovery. Decision log, tradeoffs. |
| Design-and-implement | End-to-end: read repo → ask requirements → recommend → generate Terraform/CDK/CI configs. |
| Incremental fix | Patch-style fixes for existing repos (no full rebuild). |
| Federal compliance | NIST control mapping, DoD Zero Trust pillars. Evidence-based; never claims compliance. |
| GitOps audit | CI/CD, ArgoCD/Flux, deployment safety, observability. |
| Quality gate | Verdict READY / CONDITIONAL / NOT_READY. Can block push when enforced. |

---

## Supported Workflows

1. **Quick review** — Light assessment, top 5 findings (`/quick-review`)
2. **Full assessment** — Multi-pass review, scorecard, findings (`/repo-assess`)
3. **Design-and-implement** — Read repo → requirements → architecture → IaC (`/design-and-implement`)
4. **Incremental fix** — Patch-style fixes for existing repos (`/incremental-fix`)
5. **Federal checklist** — NIST/DoD control mapping (`/federal-checklist`)
6. **Quality gate** — Production readiness verdict (`/quality-gate`)

---

## Who This Repo Is For

- Platform engineers and SREs reviewing AWS infrastructure repos
- DevSecOps teams preparing for federal or regulated environments
- Architects designing from requirements and generating IaC
- Teams using OpenCode, Cursor, or Claude Code for AI-assisted review

---

## Repository Structure

```
aws-repo-well-architected-advisor/
├── .opencode/           # OpenCode config, commands, plugins, tools
├── .claude/             # Claude Code config (CLAUDE.md)
├── .cursor/rules/       # Cursor rules (aws-well-architected.md)
├── skills/              # AWS Well-Architected Pack (10 modules)
├── aws-repo-scaffolder/ # IaC generation skill
├── cloud-architecture-ai-auditor/  # Questionnaires, discovery
├── schemas/             # review-score, solution-brief, incremental-fix
├── docs/                # Documentation
├── examples/            # Sample output, quality-gate result
├── scripts/             # Validation, install
├── hooks/               # Pre-push quality gate
├── opencode.json        # Root config (symlink or copy of .opencode)
├── install.sh           # Unix install script
└── install.ps1          # Windows install script
```

See [docs/repo-structure.md](docs/repo-structure.md) for details.

---

## Quick Start

```bash
git clone https://github.com/Jade/aws-repo-well-architected-advisor.git
cd aws-repo-well-architected-advisor
cd .opencode && bun install   # or: npm install
opencode run "/repo-assess"
```

Produces: weighted scorecard, findings with evidence tags, production readiness verdict.

---

## Installation / Setup by Tool

### OpenCode

1. Clone this repo or run `./install.sh --dest /path/to/your-repo`
2. Ensure OpenCode is installed.
3. Set config: copy `.opencode/opencode.json` to `opencode.json` at repo root, or set `OPENCODE_CONFIG=.opencode/opencode.json`
4. Install plugin deps: `cd .opencode && bun install` (or `npm install`)
5. Run: `opencode run "/repo-assess"` or use commands in TUI.

See [docs/opencode.md](docs/opencode.md).

### Cursor

1. Open repo in Cursor.
2. Rules are in `.cursor/rules/aws-well-architected.md` (auto-applied for IaC/CI files).
3. Use chat or agent mode: "Run AWS Well-Architected review" or "Run /repo-assess".
4. To install into another repo: `./install.sh --target cursor --dest /path/to/repo`

See [docs/cursor.md](docs/cursor.md).

### Claude Code

1. Open repo in Claude Code.
2. Reference `.claude/CLAUDE.md` for instructions.
3. Use commands: "Run full assessment", "Run federal compliance review".

See [docs/claude.md](docs/claude.md).

### Ravvix

No Ravvix-specific integration is present. See [docs/ravvix.md](docs/ravvix.md) for provisional guidance.

---

## Commands

| Command | Use When |
|---------|----------|
| `/quick-review` | Fast light assessment; top 5 findings |
| `/repo-assess` | Full repository architecture assessment |
| `/solution-discovery` | Starting design; need requirements |
| `/platform-design` | Have requirements; need reference architecture |
| `/scaffold` | Have design or findings; need Terraform/CDK |
| `/design-and-implement` | Full flow: read repo → requirements → recommend → code |
| `/incremental-fix` | Existing repo; patch-style fixes |
| `/federal-checklist` | NIST/DoD compliance review |
| `/gitops-audit` | CI/CD, ArgoCD, Flux assessment |
| `/quality-gate` | Production readiness gate |
| `/verify` | Validate findings have evidence tags |
| `/doc-sync` | Sync architecture docs with repo state |
| `/checkpoint` | Checkpoint review state |
| `/orchestrate` | Multi-phase review orchestration |

See [docs/commands.md](docs/commands.md).

---

## Modes

| Mode | Command(s) | Behavior |
|------|------------|----------|
| QUICK_REVIEW | `/quick-review` | Light assessment: discovery → top risks → score |
| DEEP_ANALYSIS | `/repo-assess`, `/orchestrate` | Full multi-pass review |
| BUILD_MODE | `/design-and-implement`, `/scaffold` | Design and generate IaC |
| FEDERAL_MODE | `/federal-checklist` | NIST 800-series + DoD overlay |
| DOD_ZERO_TRUST_MODE | `/federal-checklist` | DoD Zero Trust pillars emphasis |
| COST_OPTIMIZED | `/repo-assess` (user request) | Cost-focused review |
| HIGH_AVAILABILITY | `/design-and-implement`, `/scaffold` (user request) | HA defaults |

See [docs/modes.md](docs/modes.md).

---

## Evidence Model

Every finding must have:

- **evidence_type**: `observed` | `inferred` | `missing` | `contradictory` | `unverifiable`
- **confidence**: `Confirmed` | `Strongly Inferred` | `Assumed` (or **confidence_score** 0.0–1.0 in v3)

We never assume compliance. We never fabricate evidence.

See [docs/evidence-model.md](docs/evidence-model.md).

---

## Federal / NIST / DoD Support

When `/federal-checklist` runs:

- Maps findings to NIST 800-53, 800-37, 800-190, 800-204
- Maps to DoD Zero Trust and DoD DevSecOps
- Outputs **NIST_ALIGNMENT** and **DOD_ALIGNMENT** (STRONG | PARTIAL | WEAK)
- Uses **allowed claims only**: "aligned with", "supports", "lacks evidence for" — never "compliant", "certified", "FedRAMP authorized"

See [docs/federal-mode.md](docs/federal-mode.md).

---

## Output Examples

- `examples/validated-review-output.json` — Schema-conformant review output
- `examples/quality-gate-result-sample.json` — Quality gate verdict

Validate output:

```bash
./scripts/validate-review-output.sh path/to/review-output.json
```

---

## Development and Contribution

- Run tests: `npm test`
- Add skills: see [docs/development.md](docs/development.md)
- Add commands: edit `.opencode/opencode.json` and `opencode.json`
- See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## Limitations / Non-Goals

- **Does not claim compliance** — Alignment ratings only; no FedRAMP/ATO certification
- **Does not run `terraform apply`** — IaC generation only; user applies manually
- **Does not replace human review** — Advisor assists; final decisions are human
- **OpenCode primary** — Full command set and plugin require OpenCode; Cursor/Claude use subset

---

## Key Files

| File | Purpose |
|------|---------|
| [docs/core-ai-guidance.md](docs/core-ai-guidance.md) | Canonical AI guidance (AGENTS.md, CLAUDE.md, .cursor/rules) |
| [docs/AI-CLOUD-ARCHITECT-AGENT.md](docs/AI-CLOUD-ARCHITECT-AGENT.md) | v2 agent spec: multi-pass reasoning, evidence model |
| [docs/AI-CLOUD-ARCHITECT-AGENT-NIST-DOD.md](docs/AI-CLOUD-ARCHITECT-AGENT-NIST-DOD.md) | v3 NIST/DoD overlay |
| [docs/modes.md](docs/modes.md) | Mode routing |
| [.opencode/opencode.json](.opencode/opencode.json) | Commands, agents, plugin |
| [skills/aws-well-architected-pack/](skills/aws-well-architected-pack/) | 10 specialist modules |
| [schemas/review-score.schema.json](schemas/review-score.schema.json) | Output schema |
| [INSTALL.md](INSTALL.md) | Full installation |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | FAQ |
