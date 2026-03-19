# AWS Repo Well-Architected Advisor

**Evidence-based repository architecture reviews for AWS Well-Architected, federal compliance (NIST/FedRAMP), and GitOps. Jade uses OpenCode; this pack runs on the OpenCode platform with Cursor support.**

---

## What We Do

We evaluate repositories against AWS Well-Architected pillars and produce structured, evidence-based findings with production-readiness verdicts. All outputs follow a strict evidence model: **Observed**, **Inferred**, or **Missing Evidence** — never assumed compliance.

| Capability | Description |
|------------|-------------|
| **Repository assessment** | Full architecture review: IaC (Terraform, CDK, CloudFormation), CI/CD, Kubernetes. Weighted scorecard, findings, production readiness. |
| **Solution discovery** | Requirements gathering: users, traffic, budget, compliance level, constraints. Produces solution brief. |
| **Platform design** | Reference architecture from discovery. Decision log, tradeoffs, target architecture. |
| **Federal compliance** | NIST control mapping (AC, IA, SC, AU, SI, CM, IR). FedRAMP readiness. Evidence-based; stops on missing critical controls. |
| **GitOps audit** | CI/CD, ArgoCD/Flux, deployment safety, observability. |
| **Quality gate** | Production readiness verdict (READY / CONDITIONAL / NOT_READY). Can block `git push` when enforced. |

---

## Supported Platforms

| Platform | Support |
|----------|---------|
| **OpenCode** | Full — commands, agents, plugin, native tools |
| **Cursor** | Rules for AWS architecture review (IaC, CI configs) |
| **Claude Code** | CLAUDE.md, agents (repo-auditor, federal-security-reviewer) |

---

## Installation

### Option 1: Use This Repo Directly

```bash
git clone https://github.com/Jade/aws-repo-well-architected-advisor.git
cd aws-repo-well-architected-advisor
cd .opencode && bun install   # or: npm install
opencode run "/repo-assess"
```

### Option 2: Install Into Another Repo

```bash
# Clone this repo first
git clone https://github.com/Jade/aws-repo-well-architected-advisor.git
cd aws-repo-well-architected-advisor

# Install into your target repo
./install.sh --dest /path/to/your-repo [--hooks]    # Unix/macOS
.\install.ps1 -Dest C:\path\to\your-repo [-Hooks]   # Windows PowerShell

# Add Cursor rules
./install.sh --target cursor --dest /path/to/your-repo

# Add Claude Code config
./install.sh --target claude --dest /path/to/your-repo
```

**Flags:**
- `--dest DIR` — Destination directory (default: current)
- `--target opencode|cursor|claude` — opencode (default), cursor, or claude
- `--hooks` — Install pre-push quality gate hook

### Option 3: Pre-Push Enforcement

To block pushes when quality gate has not passed:

```bash
cp hooks/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push
export AWS_PACK_ENFORCE_QUALITY_GATE=true
```

Then run `/quality-gate` before pushing. Verdict READY or CONDITIONAL allows push.

---

## Usage

### Run a Full Assessment

```bash
opencode run "/repo-assess"
```

Produces: weighted scorecard, findings with evidence tags, production readiness verdict, top remediation priorities.

### Run Quality Gate

```bash
opencode run "/quality-gate"
```

Writes `.opencode/quality-gate-result.json`. Use before push when enforcement is enabled.

### Other Commands

| Command | Use When |
|---------|----------|
| `/solution-discovery` | Starting a new design; need requirements |
| `/platform-design` | Have requirements; need reference architecture |
| `/federal-checklist` | NIST/FedRAMP compliance review |
| `/gitops-audit` | CI/CD, ArgoCD, Flux assessment |
| `/verify` | Validate findings have evidence tags |
| `/doc-sync` | Sync architecture docs with repo state |

---

## Native Tools

Agents can call these tools during review:

| Tool | Purpose |
|------|---------|
| `review_score` | Compute weighted score and letter grade from category scores |
| `evidence_extractor` | Extract and validate evidence tags from findings text |
| `quality_gate_check` | Check if quality gate has passed (file or session) |

---

## Governance Plugin

The plugin (`.opencode/plugins/aws-well-architected-enforcement.ts`) enforces:

**Runtime:** `AWS_PACK_HOOK_PROFILE=minimal|standard|strict` (default: strict)
- **minimal** — Only block dangerous commands
- **standard** — + block .env read, push without quality gate (when enforced)
- **strict** — + message secret detection, file.edited logging

- **Blocks** reading `.env`, secrets, `.pem`, `.key`
- **Blocks** `git push` without quality gate when `AWS_PACK_ENFORCE_QUALITY_GATE=true`
- **Blocks** dangerous commands (e.g. `rm -rf /`)
- **Flags** infra file edits for doc-sync
- **Logs** potential secrets in messages

---

## Evidence Model

Every finding must have:

- **evidence_type**: `observed` \| `inferred` \| `missing` \| `contradictory`
- **confidence**: `Confirmed` \| `Strongly Inferred` \| `Assumed`

We never assume compliance. We never fabricate evidence.

---

## Scoring

| Category | Weight |
|----------|--------|
| Security | 20% |
| Reliability | 15% |
| Performance | 10% |
| Cost Optimization | 15% |
| Operational Excellence | 15% |
| Observability | 15% |
| Compliance Evidence Quality | 10% |

**Output:** weighted score (0–10), letter grade (A–F), production readiness (READY \| CONDITIONAL \| NOT_READY).

Schema: `schemas/review-score.schema.json`

---

## Validate Output

```bash
# Validate JSON against schema
./scripts/validate-review-output.sh path/to/review-output.json   # Unix/macOS
.\scripts\validate-review-output.ps1 path\to\review-output.json  # Windows
```

Default: `examples/validated-review-output.json`. Requires Node.js and `npx`.

---

## Run Tests

```bash
npm test
```

Runs: schema validation, review-score logic, install script checks. See [INSTALL.md](INSTALL.md).

---

## Key Files

| File | Purpose |
|------|---------|
| [.opencode/opencode.json](.opencode/opencode.json) | Commands, agents, plugin config |
| [.opencode/tools/](.opencode/tools/) | Native tools: review-score, evidence-extractor, quality-gate-check |
| [skills/aws-well-architected-pack/](skills/aws-well-architected-pack/) | 10 specialist modules + conductor |
| [schemas/review-score.schema.json](schemas/review-score.schema.json) | Output schema |
| [INSTALL.md](INSTALL.md) | Full installation, plugin verification |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | FAQ and common issues |
| [docs/LEGACY-SKILLS.md](docs/LEGACY-SKILLS.md) | Legacy skills vs pack |
| [docs/RELEASE.md](docs/RELEASE.md) | Release process |

---

## How This Differs From Generic Packs

- **Focused** — AWS Well-Architected, federal compliance, GitOps only
- **Evidence-first** — No assumed compliance; findings require evidence tags
- **Command-driven** — 10 commands with defined agents and skill graphs
- **Enforced** — Plugin blocks unsafe actions; quality gate can block push
- **Schema-backed** — All review output conforms to `review-score.schema.json`
