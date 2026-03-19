# Migration Map: Source Repo → AWS Well-Architected Pack

Mapping from the original aws-repo-well-architected-advisor repository structure to this OpenCode skill pack.

## Source Repository

- **Source**: https://github.com/LongTheta/aws-repo-well-architected-advisor
- **Structure**: Monolithic repo with skills as sibling directories (cloud-architecture-ai-auditor, security-review, etc.)

## Target Structure

- **Target**: `skills/aws-well-architected-pack/`
- **Structure**: Single pack with modules as subdirectories; plug-and-play for OpenCode

---

## File Mapping

| Source (Original Repo) | Target (Skill Pack) |
|------------------------|---------------------|
| `skill-trigger-matrix.yaml` | `routing/trigger-matrix.yaml` |
| `cloud-architecture-ai-auditor/scoring-schema.yaml` | `scoring/scoring-model.md` + `scoring/review-score.schema.json` |
| `cloud-architecture-ai-auditor/report-template.md` | `scoring/report-template.md` |
| `cloud-architecture-ai-auditor/repo-discovery/SKILL.md` | `modules/repo-discovery/SKILL.md` |
| `cloud-architecture-ai-auditor/architecture-inference/SKILL.md` | `modules/architecture-inference/SKILL.md` |
| `aws-architecture-pattern-advisor/SKILL.md` | `modules/aws-architecture-pattern-review/SKILL.md` |
| `security-review/SKILL.md` | `modules/security-review/SKILL.md` |
| `networking-review/SKILL.md` | `modules/networking-review/SKILL.md` |
| `cloud-architecture-ai-auditor/devops-operability-review/SKILL.md` | `modules/devops-operability-review/SKILL.md` |
| `finops-cost-optimizer/SKILL.md` + `README.md` | `modules/finops-cost-review/SKILL.md` |
| `observability-grafana-advisor/SKILL.md` + `README.md` | `modules/observability-review/SKILL.md` |
| `nist-compliance-evaluator/SKILL.md` + `README.md` | `modules/compliance-evidence-review/SKILL.md` |
| `cloud-architecture-ai-auditor/missing-evidence-handling.yaml` | `references/evidence-model.md` |
| `RULES.md` (evidence, severity, gating) | `references/evidence-model.md` + `references/severity-model.md` |
| `aws-federal-grade-checklist/` | Merged into `compliance-evidence-review` + `references/checklist.md` |
| `architecture-decision-engine/` | Merged into `aws-architecture-pattern-review` (design recommendations) |
| `cloud-architecture-ai-auditor/well-architected-scoring-engine/SKILL.md` | Core `SKILL.md` (conductor) |
| `aws-repo-scaffolder/` | **Not migrated** — out of scope for review pack |
| `cloud-architecture-ai-auditor/samples/*` | `examples/sample-input.md` + `examples/sample-output.md` |

---

## Concept Mapping

| Original Concept | Pack Implementation |
|------------------|---------------------|
| Layered review model | `execution_order` in SKILL.md + trigger-matrix |
| Evidence-based findings | `references/evidence-model.md` (Observed, Inferred, Missing) |
| Severity scoring | `references/severity-model.md` (CRITICAL, HIGH, MEDIUM, LOW) |
| Confidence | `references/evidence-model.md` (Confirmed, Strongly Inferred, Assumed) |
| Role-based outputs | Report template section 8 (Architect, Developer, Security, Operations) |
| Specialist review modules | 10 modules under `modules/` |
| Production-readiness | `scoring/scoring-model.md` + report section 10 |
| Review modes (quick-scan, standard, deep, regulated) | `routing/trigger-matrix.yaml` → `review_modes` |
| Repo classification | `routing/trigger-matrix.yaml` → `repo_classification` |
| Final gate (aws-federal-grade-checklist) | Merged into `compliance-evidence-review` |
| Merge rules (deduplicate, preserve severity) | Core SKILL.md workflow step 3 |

---

## What Was Not Migrated

- **aws-repo-scaffolder** — Scaffolding IaC from findings; separate use case
- **architecture-decision-engine** — Spec-driven design; merged into pattern review
- **Repo-specific branding** — Removed; pack is generic
- **.cursorrules** — OpenCode uses skill-manifest + trigger-matrix
- **Sample Terraform/K8s files** — Use any repo; examples are generic

---

## Invocation Change

| Original | Pack (OpenCode) |
|----------|-----------------|
| Cursor rules + skill-trigger-matrix | OpenCode commands: `/aws-review`, `/aws-security-review`, etc. |
| Implicit routing by file patterns | Explicit in `skill-manifest.yaml` + `routing/trigger-matrix.yaml` |
| Monolithic cloud-architecture-ai-auditor | Conductor (SKILL.md) + 10 modules |
