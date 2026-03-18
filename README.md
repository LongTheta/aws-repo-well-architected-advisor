# AWS Repo Well-Architected Advisor

**The AWS-specific implementation** of a broader architecture review and platform design concept. This repo contains the modules, rules, and prompts for production-grade AWS platform design and review.

**Scope:** AWS only. No Azure or GCP. See [AWS-SCOPE.md](AWS-SCOPE.md).

---

## What This Repo Is

An **AWS-first** system that can:

- **Analyze existing repos** (Repo-Driven Mode) — infer architecture, find gaps, produce audit reports
- **Design platforms from requirements** (Spec-Driven Mode) — questionnaire → decision engine → blueprint
- **Enforce federal-grade compliance** — aws-federal-grade-checklist as strict production-readiness gate

---

## Repository Structure (Actual Layout)

```
aws-repo-well-architected-advisor/
│
├── cloud-architecture-ai-auditor/       # Orchestration, rules, prompts, report synthesis
│   ├── well-architected-scoring-engine/  # Final report aggregation
│   ├── repo-discovery/                   # Inventory IaC, CI/CD, K8s
│   ├── architecture-inference/           # Infer current-state AWS architecture
│   ├── devops-operability-review/        # CI/CD, deployment safety
│   ├── operating-modes.yaml              # Repo-Driven vs Spec-Driven
│   ├── aws-architecture-decision-engine.md
│   ├── aws-app-platform-questionnaire.md
│   ├── tagging-compliance.yaml
│   ├── skill-trigger-matrix.yaml         # File/content → skills; execution order
│   └── samples/
│
├── aws-architecture-pattern-advisor/     # Service selection, anti-patterns
├── aws-federal-grade-checklist/          # Federal-grade compliance gate (strict)
├── nist-compliance-evaluator/            # NIST, Zero Trust, CIS, FedRAMP
├── observability-grafana-advisor/        # CloudWatch, Grafana, Golden Signals
├── finops-cost-optimizer/                # Cost optimization, savings
├── security-review/                      # IAM, secrets, encryption
├── networking-review/                    # VPC, subnets, SGs, NAT
├── devops-review/                        # CI/CD, GitOps
│
├── RULES.md                              # Rule-based routing; aws-federal-grade-checklist rules
├── .cursorrules                          # Condensed rules for Cursor IDE
├── skill-trigger-matrix.yaml             # Root-level trigger matrix
└── review-workflow.md                    # Structured workflow prompts
```

---

## Top-Level Modules

| Module | Purpose |
|--------|---------|
| **aws-architecture-pattern-advisor** | Service selection (Lambda/ECS/EKS/EC2); anti-patterns; right-sizing |
| **aws-federal-grade-checklist** | **Strict production-readiness gate** — NIST, FedRAMP, DoD DevSecOps, Zero Trust, FinOps tagging |
| **cloud-architecture-ai-auditor** | Orchestration; Repo-Driven/Spec-Driven modes; decision engine; report synthesis |
| **nist-compliance-evaluator** | NIST 800-53, 800-207 (Zero Trust), CIS, FedRAMP |
| **observability-grafana-advisor** | CloudWatch, Grafana, Golden Signals, DORA |
| **finops-cost-optimizer** | Cost optimization, savings, tagging |
| **security-review** | IAM, secrets, encryption |
| **networking-review** | VPC, subnets, security groups, NAT |
| **devops-review** | CI/CD, GitOps |

---

## How the Modules Work Together

```
1. REPO DISCOVERY (repo-discovery)
   └── Inventory IaC, CI/CD, K8s, configs

2. ARCHITECTURE INFERENCE (architecture-inference)
   └── Infer current-state AWS architecture

3. SPECIALIST REVIEWS (triggered by file/content patterns)
   └── aws-architecture-pattern-advisor
   └── nist-compliance-evaluator
   └── finops-cost-optimizer
   └── devops-operability-review
   └── observability-grafana-advisor
   └── security-review, networking-review (as needed)

4. FEDERAL-GRADE GATE (aws-federal-grade-checklist) — runs last
   └── Triggers: Terraform, CDK, CloudFormation, IAM, security, compliance, regulated
   └── Verdict: NOT READY / CONDITIONAL / READY

5. REPORT SYNTHESIS (well-architected-scoring-engine)
   └── Aggregate findings; produce final report
```

---

## Repo-Driven Mode

**When:** Repos are provided; user asks for analysis, review, or improvements.

**Flow:** Repo discovery → architecture inference → specialist reviews (file-triggered) → aws-federal-grade-checklist (if triggered) → report synthesis.

**Artifacts inspected:** Terraform, CDK, CloudFormation, Docker, CI/CD, Kubernetes (EKS).

**Output:** Audit-style report, remediation backlog, target-state AWS architecture.

---

## Spec-Driven Mode

**When:** No repo; user asks to design a system or provides requirements.

**Flow:** Application questionnaire (12 questions) → aws-architecture-decision-engine → platform blueprint.

**Output:** Architecture decisions, cost estimate, implementation plan, growth path.

---

## Rule-Based Routing

Routing is driven by three files:

| File | Role |
|------|------|
| **RULES.md** | Defines which skills run for which repo types; aws-federal-grade-checklist rules (critical → NOT READY; high → require remediation; missing tags = governance failure). |
| **.cursorrules** | Condensed rules for Cursor IDE; file triggers and AWS-specific skill mapping. |
| **cloud-architecture-ai-auditor/skill-trigger-matrix.yaml** | Maps file patterns (e.g. `*.tf`, `cdk.json`) and content patterns (e.g. hardcoded secrets, 0.0.0.0/0) to skills; defines execution order (tier 1–5); includes production-readiness gate. |

Root `skill-trigger-matrix.yaml` provides high-level triggers for external skill systems. The orchestration for this repo’s modules uses `cloud-architecture-ai-auditor/skill-trigger-matrix.yaml`.

---

## aws-federal-grade-checklist

Strict production-readiness gate. Evaluates against:

- AWS Well-Architected Framework
- NIST SP 800-53 (AC, IA, AU, SC, CM, SI, CP, IR)
- FedRAMP-style cloud expectations
- DoD DevSecOps / Zero Trust
- FinOps governance and tagging

**Runs last** among specialist skills. **Critical findings → NOT READY.** **High findings → require remediation before production.**

---

## Mandatory Tagging

Required tags: Project, Environment, Owner, CostCenter, ManagedBy, Purpose, DataClassification, Lifecycle.

**Missing required tags = governance failure.** See `cloud-architecture-ai-auditor/tagging-compliance.yaml`.

---

## Key Files

| File | Purpose |
|------|---------|
| `AWS-SCOPE.md` | AWS-only scope |
| `CONTRIBUTING.md` | Contribution guidelines |
| `RULES.md` | Rule-based routing; aws-federal-grade-checklist rules |
| `.cursorrules` | Condensed rules for Cursor |
| `cloud-architecture-ai-auditor/README.md` | Full system documentation |
| `cloud-architecture-ai-auditor/orchestrator-prompt.md` | Coordination prompt |
| `cloud-architecture-ai-auditor/skill-trigger-matrix.yaml` | File/content → skills; execution order |
| `aws-federal-grade-checklist/README.md` | Federal-grade checklist documentation |

---

## End Goal

This repository is the **AWS-first architecture review and platform design system**, with **aws-federal-grade-checklist** as the strict compliance and production-readiness gate.
