# AWS Repo Well-Architected Advisor

**The AWS-specific implementation** of a broader architecture review and platform design concept. Production-grade platform design and review for AWS workloads.

**Scope:** AWS only. No Azure or GCP logic. See [AWS-SCOPE.md](AWS-SCOPE.md).

---

## What This Repo Is

This repository is an **AWS-first architecture review and platform design system** that supports:

| Capability | Description |
|------------|-------------|
| **Repo-Driven Mode** | Analyze existing repos; infer AWS architecture; identify gaps |
| **Spec-Driven Mode** | Design the cheapest safe AWS platform from requirements |
| **Federal-Grade Compliance** | Strict production-readiness gate (aws-federal-grade-checklist) |
| **Cost-Aware Recommendations** | Default to cost-effective baseline; avoid over-engineering |
| **Governance and Tagging** | Mandatory tagging; cost allocation; compliance |

---

## Repository Structure (Actual Layout)

```
aws-repo-well-architected-advisor/
│
├── cloud-architecture-ai-auditor/     # Core orchestration, rules, prompts
│   ├── well-architected-scoring-engine
│   ├── repo-discovery
│   ├── architecture-inference
│   ├── devops-operability-review
│   ├── operating-modes.yaml
│   ├── aws-architecture-decision-engine.md
│   ├── aws-app-platform-questionnaire.md
│   ├── tagging-compliance.yaml
│   └── samples/
│
├── aws-architecture-pattern-advisor   # Service selection, anti-patterns
├── aws-federal-grade-checklist       # Federal-grade compliance gate (strict)
├── nist-compliance-evaluator         # NIST, Zero Trust, CIS, FedRAMP
├── observability-grafana-advisor     # CloudWatch, Grafana, Golden Signals
├── finops-cost-optimizer             # Cost optimization, savings
├── security-review                  # IAM, secrets, encryption
├── networking-review                 # VPC, subnets, SGs, NAT
├── devops-review                     # CI/CD, GitOps
│
├── RULES.md                          # Rule-based routing
├── .cursorrules                      # Condensed rules for Cursor
├── skill-trigger-matrix.yaml         # (in cloud-architecture-ai-auditor)
└── review-workflow.md               # Structured workflow prompts
```

---

## Specialist Modules

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

3. SPECIALIST REVIEWS (file/content triggered)
   └── aws-architecture-pattern-advisor
   └── nist-compliance-evaluator
   └── finops-cost-optimizer
   └── devops-operability-review
   └── observability-grafana-advisor
   └── security-review, networking-review (as needed)

4. FEDERAL-GRADE GATE (aws-federal-grade-checklist) — RUNS LAST
   └── Strict production-readiness evaluation
   └── Triggers: Terraform, CDK, CloudFormation, IAM, security, compliance, regulated
   └── Verdict: NOT READY / CONDITIONAL / READY

5. REPORT SYNTHESIS (well-architected-scoring-engine)
   └── Aggregate findings; produce final report
```

**Rule-driven routing** uses `RULES.md`, `.cursorrules`, and `cloud-architecture-ai-auditor/skill-trigger-matrix.yaml` to select skills based on repo contents and user requests.

---

## Operating Modes

### Repo-Driven Mode

**Trigger:** Repos provided; user asks for analysis, review, or improvements.

**Flow:** Repo discovery → architecture inference → specialist reviews → **aws-federal-grade-checklist** (if triggered) → report synthesis.

**Artifacts inspected:** Terraform, CDK, CloudFormation, Docker, CI/CD, Kubernetes (EKS).

---

### Spec-Driven Mode

**Trigger:** No repo; user asks to design a system or provides requirements.

**Flow:** Application questionnaire → decision engine → platform blueprint.

**Output:** Architecture decisions, cost estimate, implementation plan.

---

## aws-federal-grade-checklist (Production-Readiness Gate)

The **aws-federal-grade-checklist** skill acts as the strict compliance and production-readiness gate. It evaluates against:

- AWS Well-Architected Framework
- NIST SP 800-53 control families (AC, IA, AU, SC, CM, SI, CP, IR)
- FedRAMP-style cloud expectations
- DoD DevSecOps / Zero Trust principles
- FinOps governance and tagging

**Runs last** in the review flow. **Critical findings → NOT READY.** **High findings → require remediation before production.**

---

## Mandatory Tagging

All AWS resources must include: Project, Environment, Owner, CostCenter, ManagedBy, Purpose, DataClassification, Lifecycle.

**Missing required tags = governance failure.** See `cloud-architecture-ai-auditor/tagging-compliance.yaml`.

---

## Rule-Based Routing

| File | Purpose |
|------|---------|
| `RULES.md` | Rule-based skill routing; production-readiness rules |
| `.cursorrules` | Condensed rules for Cursor IDE |
| `cloud-architecture-ai-auditor/skill-trigger-matrix.yaml` | File/content patterns → skills; execution order |

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
| `cloud-architecture-ai-auditor/skill-trigger-matrix.yaml` | File/content patterns → skills; execution order |
| `aws-federal-grade-checklist/README.md` | Federal-grade checklist documentation |

---

## End Goal

This repository functions as the **AWS-first architecture review and platform design system**, with **aws-federal-grade-checklist** acting as the strict compliance and production-readiness gate.
