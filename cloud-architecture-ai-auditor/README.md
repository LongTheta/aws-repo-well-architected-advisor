# Cloud Architecture AI Auditor

An **AI-powered Cloud Architecture Review Board** that analyzes repositories (application code, IaC, CI/CD, Kubernetes manifests) and produces a full-stack, enterprise-grade assessment for AWS-based infrastructure.

## Purpose

Guide **Solutions Architects**, **Developers/Platform Engineers**, and **Security Engineers** toward a cost-effective, secure, reliable, and observable architecture—from networking to IAM and everything in between.

## Core Frameworks (Mandatory)

| Framework | Scope |
|-----------|-------|
| **AWS Well-Architected** | Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability |
| **CompTIA Cloud+** | IaC, CI/CD, monitoring, backup/DR (RTO/RPO), troubleshooting, networking |
| **NIST / CIS** | NIST 800-53, 800-207 (Zero Trust), 800-190 (containers), CIS Benchmarks |
| **Observability** | SRE Golden Signals, DORA metrics |
| **FinOps** | AWS Cost Optimization Pillar, FinOps Foundation |
| **AWS Whitepapers** | VPC, IAM, compute selection, storage, HA design |

## System Architecture (Modular Skills)

```
cloud-architecture-ai-auditor
│
├── well-architected-scoring-engine   # Orchestrator — aggregates all modules
├── repo-discovery                    # Inventory IaC, CI/CD, K8s, configs
├── architecture-inference            # Infer current-state from artifacts
├── aws-architecture-pattern-advisor  # Service selection, anti-patterns
├── nist-compliance-evaluator         # NIST, Zero Trust, CIS, FedRAMP
├── observability-grafana-advisor      # Grafana, Golden Signals, DORA
├── finops-cost-optimizer             # Cost optimization, savings
└── devops-operability-review         # CI/CD, GitOps, deployment safety
```

*Note: aws-architecture-pattern-advisor, nist-compliance-evaluator, observability-grafana-advisor, finops-cost-optimizer are sibling skills in the parent repo.*

## Analysis Capabilities

| Artifact Type | Paths | Purpose |
|---------------|-------|---------|
| Terraform / OpenTofu / Terragrunt | `*.tf`, `*.tf.json` | IaC |
| CloudFormation / CDK | `*.yaml`, `*.json`, `cdk.json` | IaC |
| Kubernetes | `*.yaml`, Helm, Kustomize | EKS workloads |
| Dockerfiles | `Dockerfile` | Container build |
| GitHub Actions | `.github/workflows/` | CI/CD |
| GitLab CI | `.gitlab-ci.yml` | CI/CD |
| Application configs | `.env*`, config files | Env, secrets |
| IAM | `iam.tf`, policy files | Roles, policies |
| Networking | `vpc.tf`, `*.tf` | VPC, subnets, SGs |

## Evaluation Domains

1. Account strategy (single vs multi-account)
2. Networking (VPC, subnets, ingress/egress, endpoints)
3. IAM and identity boundaries
4. Secrets and encryption
5. Compute (EC2, ECS, EKS, Lambda)
6. Storage and database design
7. Integration (SQS, SNS, EventBridge, APIs)
8. CI/CD and deployment safety
9. Observability (logs, metrics, traces)
10. Reliability and DR (RTO/RPO, backups)
11. Cost efficiency
12. Governance and compliance

## AWS Decision Engine

| Rule | Recommendation |
|------|----------------|
| Event-driven, stateless | Lambda |
| Containerized, moderate complexity | ECS |
| K8s orchestration justified | EKS |
| AWS service egress | VPC endpoints over NAT |
| General | Prefer managed services |
| Over-engineered | Suggest simpler alternative |

**Anti-patterns detected**: Public backend exposure, K8s overuse, hardcoded secrets, no autoscaling, missing logging, excessive NAT cost.

See [aws-decision-engine.md](aws-decision-engine.md) for full rule-based logic.

## Cost-Aware Refinement System

Default to the most cost-effective architecture, then refine via 6 questions:

1. **Phase 1 (Default)**: Cost-optimized baseline — Lambda, managed services, VPC endpoints, single-AZ for non-critical. Label: "This is a cost-optimized baseline architecture based on minimal assumptions."
2. **Phase 2**: 6 refinement questions — Traffic, availability, data criticality, compliance, team, cost priority.
3. **Phase 3**: Adaptive architecture — Adjust compute, networking, storage, security based on answers. Output delta (what changed, why, cost/risk impact).

See [cost-aware-refinement.md](cost-aware-refinement.md).

## Cost Estimation & Over-Engineering

- **Monthly cost estimation**: Bands (Very Low to Very High); label observed/inferred/unknown; never fake precision
- **Cheaper alternatives**: Lower-cost substitutions with tradeoffs and savings impact
- **Over-engineering detection**: Flag EKS for simple app, multi-account for small team, excessive complexity
- **Cost vs reliability**: Tag recommendations (Cost posture, Reliability posture, Ops burden)

See [cost-estimation-and-overkill.md](cost-estimation-and-overkill.md).

## Scoring Model

| Score Type | Range |
|------------|-------|
| AWS Well-Architected (per pillar) | 0–10 |
| CompTIA operational | 0–10 |
| NIST compliance | 0–10 |
| Observability maturity | 0–10 |
| Cost efficiency | 0–10 |

**Severity**: Critical / High / Medium / Low  
**Confidence**: Confirmed / Inferred / Missing Evidence

## Output Format

1. Executive Summary
2. Inferred Current-State Architecture
3. Multi-Framework Scorecard
4. Top 10 Risks
5. Findings by Role (Architect, Developer, Security)
6. NIST Compliance Gaps
7. Observability / Grafana Dashboard Plan
8. Cost Optimization Opportunities
9. Prioritized Remediation Backlog
10. Target-State Architecture Recommendation

## Evidence Rules

- **Observed** — Direct evidence in repo
- **Inferred** — Derived from patterns
- **Missing Evidence** — No proof; highlight unknowns

## Operating Rules

All outputs must follow [cloud-architecture-ai-auditor-rules.md](cloud-architecture-ai-auditor-rules.md): evidence first, cost-effective by default, avoid over-engineering, security non-negotiable, role-aware output, tradeoff explanation, mandatory report sections.

## Design Principles

- Prefer simplicity over complexity
- Prefer managed services when appropriate
- Balance cost vs reliability vs security
- Provide actionable recommendations
- Think like a Principal Solutions Architect

## Files in This System

| File | Purpose |
|------|---------|
| `README.md` | This document |
| `RULES.md` | **Project rules** — repository-wide implementation and quality standards |
| `.cursorrules` | Condensed rules for Cursor IDE |
| `ROUTING_RULES.md` | **Orchestration rules** — automatic skill selection by repo contents |
| `skill-trigger-matrix.yaml` | File/content patterns → skills, priority order |
| `orchestrator-prompt.md` | Reusable prompt for automatic coordination |
| `question-trigger-rules.yaml` | When to ask refinement questions |
| `execution-order.md` | Sequencing and tie-breaking rules |
| `operating-modes.yaml` | **Operating modes** — Repo-Driven vs Spec-Driven |
| `architect-mindset.md` | **Architect mindset** — Constraints first; 5 core areas; 4 tradeoffs |
| `aws-architecture-decision-engine.md` | **Decision engine** — Questionnaire → architecture decisions |
| `OPERATING_MODES.md` | Human-readable operating mode selection |
| `workload-sizing-rules.yaml` | Workload mode (Lightweight / Standard / Full / Regulated) |
| `cloud-architecture-ai-auditor-rules.md` | **Operating rules (mandatory)** |
| `finding-schema.yaml` | **Shared finding schema** — required fields for all skills |
| `repo-classification-rules.yaml` | Repo types: application, infrastructure, platform, gitops, mixed |
| `review-mode-definitions.yaml` | Review modes: quick-scan, standard, deep-review, regulated-review |
| `merge-logic-spec.yaml` | Duplicate merge rules |
| `rule-precedence.yaml` | Rule precedence (security → classification → optimization → questionnaire) |
| `missing-evidence-handling.yaml` | Allowed outputs: cannot_determine, inferred_only, missing_evidence, requires_user_input |
| `recommendation-guardrails.yaml` | Do-not-recommend list unless justified |
| `output-consistency-rules.yaml` | Required report sections |
| `report-template.md` | **Standardized final report template** — consulting-grade structure |
| `tagging-compliance.yaml` | **Mandatory tagging** — required tag set, validation, cost integration |
| `design-principles.md` | Consistency, determinism, practicality, simplicity, transparency |
| `scoring-schema.yaml` | Shared scoring schema |
| `aws-decision-engine.md` | AWS decision logic, anti-patterns, service selection |
| `cost-aware-refinement.md` | Cost-aware baseline, 6 refinement questions, adaptive architecture |
| `cost-estimation-and-overkill.md` | Monthly cost estimation, cheaper alternatives, over-engineering detection |
| `sample-input-repo-structure.md` | Expected repo layout |
| `sample-output-report.md` | Consulting-grade report |
| `samples/sample_app_repo/` | Sample application repo (minimal structure) |
| `samples/sample_infra_repo/` | Sample infrastructure repo (minimal structure) |
| `samples/sample_gitops_repo/` | Sample GitOps repo (minimal structure) |
| `samples/sample-input-app-repo.md` | Sample application repo input (documentation) |
| `samples/sample-input-infra-repo.md` | Sample infrastructure repo input (documentation) |
| `samples/sample-input-gitops-repo.md` | Sample GitOps repo input (documentation) |
| `samples/sample-report-app.md` | Sample report for application repo |
| `samples/sample-report-infra.md` | Sample report for infrastructure repo |
| `samples/sample-report-gitops.md` | Sample report for GitOps repo |
| `production-readiness-checklist.md` | Pre-production checklist |
| `prompt-template.md` | Invocation template |
| `cloud-architecture-client-questionnaire.md` | Reusable 6-question refinement prompt |
| `aws-platform-blueprint-for-app.md` | **Platform design prompt** — full AWS platform from ground up |
| `aws-app-platform-questionnaire.md` | **Platform questionnaire** — 12 questions to right-size design |
| `well-architected-scoring-engine/SKILL.md` | Orchestrator |
| `repo-discovery/SKILL.md` | Repo discovery module |
| `architecture-inference/SKILL.md` | Architecture inference module |
| `devops-operability-review/SKILL.md` | DevOps/operability module |

## Usage

Invoke the orchestrator:

```
Run a full cloud architecture review on my repository.
Use the cloud-architecture-ai-auditor system.
```

Or invoke individual modules for focused analysis.
