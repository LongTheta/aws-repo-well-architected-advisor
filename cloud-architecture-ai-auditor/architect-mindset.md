# Architect Mindset — Constraints, Risks, and Tradeoffs First

A real solutions architect does **not** think about services first. They think about **constraints, risks, and tradeoffs**. This document defines how the system should reason before recommending any AWS service.

---

## Core Principle

**If business context is wrong → everything else is wrong.**

The questionnaire and decision engine exist to translate answers into decisions — not just collect answers. Every service choice must be traceable to constraints derived from the answers.

---

## The 5 Core Areas (In Order)

### 1. Business & Product Context (MOST IMPORTANT)

**Questions:**
- What problem are we solving?
- Who are the users?
- What happens if the system goes down?
- Is this revenue-generating or internal?
- What's the expected growth in 6–12 months?
- What's more important: **cost or reliability?**

**Drives:**
- Overbuild vs underbuild
- Risk tolerance
- Spending strategy

**Maps to questionnaire:** `app_type`, `user_access`, `availability_requirement`, `cost_priority`, `growth_expectation`

---

### 2. Users & Access Patterns

**Questions:**
- Public users or internal only?
- How many users now vs expected?
- Is traffic steady or spiky?
- Where are users located geographically?
- Do users need real-time responses?

**Drives:**
- CDN usage
- Load balancing
- Scaling strategy
- Latency decisions

**Maps to questionnaire:** `user_access`, `traffic_level`, `growth_expectation`

---

### 3. Data & State (THIS IS HUGE)

**Questions:**
- What type of data? Relational? Documents? Files?
- How critical is the data?
- How much data (now vs future)?
- Do you need transactions?
- Do you need backups / recovery guarantees?
- Any sensitive or regulated data?

**Drives:**
- RDS vs DynamoDB vs S3
- Encryption
- Backup strategy
- Compliance posture

**Maps to questionnaire:** `data_type`, `data_importance`, `compliance_level`

---

### 4. Workload & Compute Behavior

**Questions:**
- Request/response (API)? Event-driven? Batch processing?
- Are jobs long-running?
- Does it need background processing?
- How predictable is usage?

**Drives:**
- Lambda vs ECS vs EC2 vs EKS
- Queues (SQS)
- Event buses (EventBridge)

**Maps to questionnaire:** `app_type`, `traffic_level`, `background_processing`

---

### 5. Security, Compliance & Risk

**Questions:**
- What level of security is required?
- Any compliance requirements (NIST, FedRAMP, HIPAA)?
- Who can access what?
- How are secrets managed?
- What happens if credentials leak?

**Drives:**
- IAM design
- Network isolation
- Secrets management
- Audit logging

**Maps to questionnaire:** `auth_type`, `compliance_level`, `user_access`

---

## Bonus: Cost & Team Reality

**Questions:**
- Budget range?
- Team size and experience?
- Who will maintain this?
- How fast do we need to ship?

**Prevents:**
- Over-engineering
- Choosing tools the team can't support

**Maps to questionnaire:** `team_size`, `cost_priority`

---

## The 4 Tradeoffs (Always Balance)

| Tradeoff | Question to Ask |
|----------|-----------------|
| **Cost vs Reliability** | "Can we afford downtime?" |
| **Simplicity vs Flexibility** | "Will this evolve?" |
| **Speed vs Security** | "What's acceptable risk?" |
| **Managed vs Custom** | "Do we want to own this?" |

Every architecture decision implicitly or explicitly resolves these. The decision engine must surface which tradeoff drove each choice.

---

## Translate Answers → Decisions (Examples)

| Answer Pattern | Decision |
|----------------|----------|
| Low traffic + solo dev | Lambda + DynamoDB |
| High compliance | Stricter IAM + audit logging |
| Spiky traffic | Serverless or autoscaling |
| Mission-critical data | RDS Multi-AZ + backups |
| Internal only | IAM / SSO; no Cognito |
| Aggressive cost | Minimize NAT; serverless first |

---

## The 10 Most Important Questions (If You Only Keep a Few)

1. What are you building?
2. Who uses it?
3. How many users now vs later?
4. How critical is uptime?
5. What kind of data?
6. How sensitive is the data?
7. Do you need background processing?
8. What's your budget priority?
9. What's your team size?
10. How fast will this grow?

These map directly to the questionnaire. If answers are unclear, ask follow-ups in these areas before recommending services.

---

## Decision Engine Flow

1. **Interpret** — Translate answers into constraints (business, users, data, workload, security)
2. **Resolve tradeoffs** — Cost vs reliability; simplicity vs flexibility; etc.
3. **Map to services** — Apply rule-based logic from `aws-architecture-decision-engine.md`
4. **Explain** — Tie every major decision back to input answers

---

## End Goal

The system should outperform generic "AI architecture tools" and many junior architects by:

- **Thinking constraints first** — Not services first
- **Translating answers into decisions** — Not just collecting answers
- **Surfacing tradeoffs** — So the user understands what they're choosing
- **Right-sizing to context** — Overbuild vs underbuild based on reality

---

## References

- `aws-app-platform-questionnaire.md` — Collects answers organized by these 5 areas
- `aws-architecture-decision-engine.md` — Maps answers → service choices
- `design-principles.md` — Platform-level principles
