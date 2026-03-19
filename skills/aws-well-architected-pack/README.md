# AWS Well-Architected Pack

OpenCode-native skill pack for evidence-based AWS architecture review. Refactored from [aws-repo-well-architected-advisor](https://github.com/Jade/aws-repo-well-architected-advisor). Plug-and-play: drop into `skills/` of a larger OpenCode system. No repo-specific branding; reusable, composable, enterprise-grade.

## Preserved Concepts

- **Multi-layer review model** — Orchestrator + specialist modules; review modes (quick-scan → regulated)
- **Specialist review modules** — 10 modules: repo-discovery, architecture-inference, security, networking, reliability, DevOps, FinOps, observability, compliance
- **Evidence tags** — Observed, Inferred, Missing Evidence, Contradictory
- **Severity scoring** — Critical, High, Medium, Low
- **Confidence levels** — Confirmed, Strongly Inferred, Assumed
- **Role-based findings** — Architect, Developer, Security, Operations
- **Production-readiness outputs** — READY / CONDITIONAL / NOT READY

## Overview

Evaluates repositories and platforms against AWS Well-Architected pillars, DevSecOps maturity, and extensible compliance (NIST, FedRAMP). Layered review model with specialist modules, evidence-based findings, severity and confidence scoring, role-based outputs, production-readiness verdicts.

## Structure

```
aws-well-architected-pack/
├── SKILL.md              # Core skill (conductor)
├── README.md              # This file
├── skill-manifest.yaml    # Pack metadata, OpenCode commands
├── routing/
│   └── trigger-matrix.yaml
├── scoring/
│   ├── scoring-model.md
│   ├── review-score.schema.json
│   └── report-template.md
├── modules/
│   ├── repo-discovery/
│   ├── architecture-inference/
│   ├── aws-architecture-pattern-review/
│   ├── security-review/
│   ├── networking-review/
│   ├── reliability-resilience-review/
│   ├── devops-operability-review/
│   ├── finops-cost-review/
│   ├── observability-review/
│   └── compliance-evidence-review/
├── examples/
│   ├── sample-input.md
│   └── sample-output.md
└── references/
    ├── checklist.md
    ├── evidence-model.md
    └── severity-model.md
```

## OpenCode Command Integration

### /aws-review

**Purpose**: Full AWS Well-Architected review

| Attribute | Value |
|----------|-------|
| **Modules run** | All (repo-discovery through compliance-evidence-review) |
| **Report shape** | Full (all 12 sections) |
| **Stop for missing evidence** | No |
| **Conditional when** | HIGH findings; missing tags in prod |

### /aws-target-architecture

**Purpose**: Infer current architecture and recommend target design

| Attribute | Value |
|----------|-------|
| **Modules run** | repo-discovery, architecture-inference, aws-architecture-pattern-review |
| **Report shape** | Architecture focus (sections 1–3, 11) |
| **Stop for missing evidence** | No |
| **Conditional when** | N/A |

### /aws-security-review

**Purpose**: Security-focused review (IAM, secrets, encryption, supply chain)

| Attribute | Value |
|----------|-------|
| **Modules run** | repo-discovery, architecture-inference, security-review |
| **Report shape** | Security focus (sections 1–2, 5–6, 8 Security, 9–10) |
| **Stop for missing evidence** | Yes |
| **Conditional when** | CRITICAL or HIGH security findings |

### /aws-production-readiness

**Purpose**: Production readiness gate with verdict

| Attribute | Value |
|----------|-------|
| **Modules run** | All |
| **Report shape** | Full |
| **Stop for missing evidence** | Yes |
| **Conditional when** | Any HIGH; missing evidence in critical controls |

## When to Stop for Missing Evidence

- **Regulated-review mode**: Stop when a critical control (e.g., encryption, IAM least privilege) has no evidence. Report "Cannot determine from repo" and recommend validation.
- **/aws-security-review**: Stop when CRITICAL or HIGH finding has Missing Evidence. Do not assume control exists.
- **/aws-production-readiness**: Stop when critical control lacks evidence. Verdict = CONDITIONAL with "Requires validation" note.

## When to Give Conditional Recommendations

- **HIGH findings present**: Verdict = CONDITIONAL; list P1/P2 items to address
- **Missing required tags in prod**: Governance failure; CONDITIONAL
- **Missing evidence in regulated review**: Treat as risk; CONDITIONAL
- **Strongly Inferred confidence**: Note "Based on inferred patterns; recommend spot-checks"

## Installation

Copy this pack into your OpenCode skills directory:

```
your-opencode-repo/
  skills/
    aws-well-architected-pack/   # This pack
```

Ensure OpenCode is configured to load skills from `skills/` and to route commands per `skill-manifest.yaml`.

## Composability

- **Standalone**: Can run as the only architecture review skill
- **Composable**: Can run alongside other skill packs (e.g., Azure, GCP, generic security)
- **No hardcoded assumptions**: Works with any repository structure; routing is pattern-based

## References

- [SKILL.md](SKILL.md) — Core conductor logic
- [skill-manifest.yaml](skill-manifest.yaml) — Commands, modules, outputs
- [routing/trigger-matrix.yaml](routing/trigger-matrix.yaml) — File and intent routing
- [scoring/scoring-model.md](scoring/scoring-model.md) — Weighted scoring
- [references/evidence-model.md](references/evidence-model.md) — Evidence tags, confidence
- [references/severity-model.md](references/severity-model.md) — Severity, production blocking
