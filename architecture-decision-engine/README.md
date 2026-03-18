# Architecture Decision Engine

An AI IDE skill that acts as a **senior AWS Solutions Architect and product-aware decision engine**. This is a **decision-making system**, not a checklist.

---

## What This Is

- **Decision engine** — Asks questions, evaluates tradeoffs, recommends AWS services, justifies choices
- **Not a checklist** — Does not validate configurations; designs and decides
- **Product-aware** — Considers users, traffic, budget, compliance before recommending architecture

---

## Two Modes

### 1. Spec-Driven Mode (PRIMARY)

When requirements are incomplete or you're designing from scratch:

- Asks structured questions (product, scale, budget, data, security, team)
- Does NOT assume scale or budget
- Designs optimal AWS architecture based on answers
- Outputs: architecture summary, recommended services, justifications, tradeoffs, cost strategy

### 2. Repo-Driven Mode

When Terraform, CDK, or CloudFormation is provided:

- Infers architecture from existing IaC
- Evaluates decisions already made
- Suggests better alternatives with justification
- Explains tradeoffs of current vs recommended approach

---

## What It Does

- **Requirement discovery** — Asks intelligent questions across product, scale, budget, data, security, team
- **Architecture decisions** — Recommends compute (Lambda/ECS/EKS/EC2), data (RDS/DynamoDB/S3/Aurora), networking, IAM, CI/CD, observability
- **Tradeoff analysis** — Option A vs Option B, pros/cons, cost impact, when to choose each
- **Cost strategy** — Low / Balanced / High-Resilience; flags risky or expensive patterns

---

## How It Complements Review Skills

| Skill | Role |
|-------|------|
| **architecture-decision-engine** | Designs and justifies architecture; asks questions; recommends services |
| **aws-federal-grade-checklist** | Validates production readiness; enforces compliance |
| **nist-compliance-evaluator** | Evaluates NIST, Zero Trust, FedRAMP alignment |
| **aws-architecture-pattern-advisor** | Service selection, anti-patterns, right-sizing |

Use the decision engine to **design**; use review skills to **validate**.

---

## Example 1: Small Startup

**Input:** Small SaaS, low traffic, cost-sensitive, small team

**Output:** Lambda + API Gateway + DynamoDB + Cognito. Serverless-first; minimal ops; pay-per-use.

---

## Example 2: Enterprise System

**Input:** High traffic, regulated, relational data, mature DevOps team

**Output:** ECS Fargate or EKS + RDS Aurora + ALB + VPC private subnets. Full control; compliance-ready; team can manage.

---

## Output Format

1. Architecture Summary
2. Recommended AWS Services
3. Decision Justifications
4. Tradeoff Analysis
5. Cost Strategy (Low / Balanced / High-Resilience)
6. Risks and Constraints
7. Suggested Next Steps

---

## Rules

- Always ask questions if input is incomplete
- Do NOT assume scale or budget
- Prefer simplest solution that meets requirements
- Avoid over-engineering
- Justify every major service choice
- Flag risky or expensive patterns

---

## Installation

Store in `~/.cursor/skills/architecture-decision-engine/` for personal use, or `.cursor/skills/architecture-decision-engine/` for project scope. Cursor loads it when the description matches (e.g., "design AWS architecture", "help me choose between Lambda and ECS").

---

## Usage Example

```
I need to design an AWS platform for a new application.
Use the architecture-decision-engine skill.
Ask me the right questions first, then recommend services and justify your decisions.
```
