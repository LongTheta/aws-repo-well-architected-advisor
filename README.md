# AWS Repo Well-Architected Advisor

## What This Is

An AI-driven AWS architecture review and platform design system.

It analyzes repositories OR gathers requirements to:
- design AWS infrastructure
- evaluate security, cost, networking, and DevOps maturity
- enforce federal-grade readiness standards

---

## Two Modes of Operation

### 1. Repo-Driven Mode
- Input: Terraform, CDK, CloudFormation, CI/CD
- System infers architecture
- Runs full review pipeline
- Outputs risks, scores, and fixes

### 2. Spec-Driven Mode
- Acts like a Solutions Architect / Product Manager
- Asks: users, traffic, budget, compliance level
- Designs optimal AWS architecture

---

## How It Works

1. **Scoping** — Classify repo (application, infrastructure, platform, GitOps, mixed); select review mode (quick-scan, standard, deep-review, regulated-review)
2. **Design / Inference** — architecture-decision-engine, cloud-architecture-ai-auditor
3. **Core Reviews** — security-review, networking-review, finops-cost-optimizer, observability-grafana-advisor, devops-review
4. **Compliance** — nist-compliance-evaluator
5. **Final Gate** — aws-federal-grade-checklist
6. **Output** — Merge findings, apply verdict rules, generate report

---

## Skills (Execution Order)

- architecture-decision-engine
- cloud-architecture-ai-auditor
- security-review
- networking-review
- finops-cost-optimizer
- observability-grafana-advisor
- devops-review
- nist-compliance-evaluator
- aws-federal-grade-checklist

---

## Final Gate

The `aws-federal-grade-checklist` acts as a strict production readiness gate.

- CRITICAL findings → NOT READY
- HIGH findings → CONDITIONAL
- Missing evidence → treated as risk
- Missing tags → governance failure

---

## Rule Engine

Routing and enforcement:

- **skill-trigger-matrix.yaml** — Repo signals, user intents → skills; review modes; verdict rules
- **RULES.md** — Review philosophy, execution, evidence, gating rules
- **.cursorrules** — Condensed routing for Cursor

---

## Output

Each run produces:

- architecture summary
- category scores
- risk classification
- remediation plan
- production readiness verdict (READY / CONDITIONAL / NOT READY)

---

## Key Files

| File | Purpose |
|------|---------|
| [skill-trigger-matrix.yaml](skill-trigger-matrix.yaml) | Repo signals, user intents → skills; review modes; verdict rules |
| [review-order.md](review-order.md) | Execution flow (phases 1–5) |
| [RULES.md](RULES.md) | Review philosophy, execution, evidence, gating rules |
| [review-mode-definitions.md](review-mode-definitions.md) | quick-scan, standard, deep-review, regulated-review |
| [repo-classification.md](repo-classification.md) | application, infrastructure, platform, GitOps, mixed |
| [final-verdict-logic.md](final-verdict-logic.md) | READY, CONDITIONAL, NOT READY |
| [example-full-run.md](example-full-run.md) | Example Terraform review with verdict |
| [POSITIONING.md](POSITIONING.md) | What this repo actually is |
| [architecture-decision-engine/README.md](architecture-decision-engine/README.md) | Decision engine (design, not checklist) |
| [AWS-SCOPE.md](AWS-SCOPE.md) | AWS-only scope |
