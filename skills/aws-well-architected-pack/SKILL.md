---
name: aws-well-architected-pack
description: OpenCode skill pack for AWS Well-Architected architecture review. Evaluates IaC (Terraform, CDK, CloudFormation), CI/CD, Kubernetes. Layered review model with evidence-based findings, severity and confidence scoring, role-based outputs. Produces production-readiness verdicts. Use when reviewing repos for Well-Architected alignment, security, cost, reliability, or federal compliance.
risk_tier: 1
---

# AWS Well-Architected Pack

OpenCode-native skill pack for evidence-based AWS architecture review. Acts as a conductor: detects context, invokes specialist modules, aggregates findings, calculates scores, generates reports.

## Preserved Concepts (from Source Repo)

| Concept | Implementation |
|---------|----------------|
| **Multi-layer review model** | Orchestrator → 10 specialist modules; review modes (quick-scan → regulated) |
| **Specialist review modules** | repo-discovery, architecture-inference, security, networking, reliability, DevOps, FinOps, observability, compliance |
| **Evidence tags** | Observed, Inferred, Missing Evidence, Contradictory — see `references/evidence-model.md` |
| **Severity scoring** | Critical, High, Medium, Low — see `references/severity-model.md` |
| **Confidence levels** | Confirmed, Strongly Inferred, Assumed — see `references/evidence-model.md` |
| **Role-based findings** | Architect, Developer, Security, Operations — report section 8 |
| **Production-readiness outputs** | READY / CONDITIONAL / NOT READY — report section 10 |

## Mission

Evaluate repositories and platforms against AWS Well-Architected pillars, DevSecOps maturity, and extensible compliance (NIST, FedRAMP). Produce structured, evidence-based findings with production-readiness verdicts and role-specific recommendations.

## When to Use

- User requests architecture review, Well-Architected assessment, or production readiness check
- User mentions AWS, Terraform, CDK, CloudFormation, Kubernetes, DevSecOps, GitOps
- Repo contains IaC, CI/CD, or platform configs
- OpenCode commands: `/aws-review`, `/aws-target-architecture`, `/aws-security-review`, `/aws-production-readiness`

## Inputs

- **Repository context**: File tree, IaC files, CI/CD configs, Kubernetes manifests
- **User intent**: Full review, security-only, cost-only, compliance, target architecture
- **Review mode** (optional): quick-scan | standard | deep-review | regulated-review
- **Repo classification** (inferred): application | infrastructure | platform | gitops | mixed

## Workflow (Conductor Pattern)

### 1. Detect Repo/System Context

- Scan file patterns (see `routing/trigger-matrix.yaml`)
- Classify repo type from artifact mix
- Select review mode from repo type + user intent
- Build artifact inventory (repo-discovery)

### 2. Invoke Review Modules

Run modules in execution order. Skip modules not triggered by file patterns or user intent.

| Phase | Module | Purpose |
|-------|--------|---------|
| 1 | repo-discovery | Artifact inventory |
| 2 | architecture-inference | Inferred architecture diagram |
| 3 | aws-architecture-pattern-review | Service choices, anti-patterns |
| 4 | security-review | IAM, secrets, encryption |
| 5 | networking-review | VPC, subnets, segmentation |
| 6 | reliability-resilience-review | Multi-AZ, backups, RTO/RPO |
| 7 | devops-operability-review | CI/CD, GitOps, runbooks |
| 8 | finops-cost-review | Cost drivers, waste, alternatives |
| 9 | observability-review | Metrics, logs, traces |
| 10 | compliance-evidence-review | NIST, FedRAMP, evidence mapping |

### 3. Aggregate Findings

- Deduplicate across modules
- Preserve highest severity per finding
- Preserve strongest confidence
- Combine framework mappings (AWS pillar, NIST control)
- Merge evidence labels

### 4. Calculate Scores

- Per-category score (0–10) with rationale
- Weighted overall score (see `scoring/scoring-model.md`)
- Letter grade (A/B/C/D/F)
- Production readiness (READY / CONDITIONAL / NOT READY)
- Confidence level (Confirmed / Strongly Inferred / Assumed)

### 5. Generate Final Report

Use `scoring/report-template.md`. Include:

1. Executive Summary
2. Scope Reviewed
3. Inferred AWS Architecture
4. Weighted Scorecard
5. Top Risks
6. Evidence Found
7. Missing Evidence
8. Role-Based Findings (Architect, Developer, Security, Operations)
9. Prioritized Remediation Backlog
10. Production Readiness Decision
11. Suggested Target Architecture
12. Next Review Pass

## Orchestration of Subskills

- **Quick-scan**: repo-discovery, architecture-inference, security-review, networking-review, finops-cost-review
- **Standard**: + observability-review, devops-operability-review
- **Deep-review**: + compliance-evidence-review, reliability-resilience-review
- **Regulated-review**: Full pipeline; evidence required; stop for missing evidence in critical controls

## Scoring Model

- **Categories**: Security, Reliability, Performance Efficiency, Cost Optimization, Operational Excellence, Observability, Compliance Evidence Quality
- **Per category**: score 0–10, rationale, evidence found, missing evidence, key risks, recommended actions
- **Final**: weighted score, letter grade, production readiness, confidence level
- See `scoring/scoring-model.md` and `scoring/review-score.schema.json`

## Production Baseline

Every review must include `production_baseline` per `docs/production-baseline.md`: required_components, missing_components, and **not_ready_reason** when NOT_READY. The reason must be explicit, not implied.

## Remediation Ordering

Order findings per `docs/remediation-ordering.md`: deployment_blocker → security_blocker → reliability → cost/optimization. Output `ordered_remediation_plan` and `ordering_reasoning`.

## Report Generation Model

- Template: `scoring/report-template.md`
- Role-based sections: findings grouped for Architect, Developer, Security, Operations
- Evidence tags: Observed | Inferred | Missing Evidence
- Severity: Critical | High | Medium | Low
- Confidence: Confirmed | Strongly Inferred | Assumed

## Stop Conditions

- **Stop for missing evidence** when: regulated-review mode and critical control has no evidence
- **Conditional recommendations** when: HIGH findings present; missing required tags in prod; missing evidence in regulated review
- **NOT READY** when: any CRITICAL finding from compliance gate

## References

- [skill-manifest.yaml](skill-manifest.yaml) — Pack metadata, OpenCode commands
- [routing/trigger-matrix.yaml](routing/trigger-matrix.yaml) — File patterns, user intents → modules
- [scoring/scoring-model.md](scoring/scoring-model.md) — Weighted scoring, letter grade
- [scoring/report-template.md](scoring/report-template.md) — Report structure
- [references/evidence-model.md](references/evidence-model.md) — Evidence tags, confidence
- [references/severity-model.md](references/severity-model.md) — Severity, production blocking
