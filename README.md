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
- Asks:
  - users
  - traffic
  - budget
  - compliance level
- Designs optimal AWS architecture

---

## Modules

- aws-architecture-pattern-advisor
- cloud-architecture-ai-auditor
- devops-review
- finops-cost-optimizer
- networking-review
- nist-compliance-evaluator
- observability-grafana-advisor
- security-review
- aws-federal-grade-checklist

---

## How It Works

1. Discover repo structure
2. Infer AWS architecture
3. Run specialized reviews
4. Aggregate scores
5. Apply federal-grade checklist
6. Produce final verdict

---

## Final Gate

The `aws-federal-grade-checklist` acts as a strict production readiness gate.

Rules:
- CRITICAL issues → NOT READY
- HIGH issues → remediation required
- Missing evidence → treated as risk
- Missing tags → governance failure

---

## Rule Engine

Routing and enforcement is controlled by:

- RULES.md
- .cursorrules
- skill-trigger-matrix.yaml

---

## Output

Each run produces:

- architecture summary
- category scores
- risk classification
- remediation plan
- production readiness verdict

---

## Who This Is For

- Solutions Architects
- DevOps Engineers
- Security Engineers
- Platform Engineers

---

## Goal

Make AWS platform design:
- consistent
- secure
- cost-effective
- production-ready

---

## Key Files

| File | Purpose |
|------|---------|
| [review-order.md](review-order.md) | Execution order (phases 1–4) |
| [example-full-run.md](example-full-run.md) | Example Terraform review with verdict |
| [POSITIONING.md](POSITIONING.md) | What this repo actually is |
| [AWS-SCOPE.md](AWS-SCOPE.md) | AWS-only scope |
