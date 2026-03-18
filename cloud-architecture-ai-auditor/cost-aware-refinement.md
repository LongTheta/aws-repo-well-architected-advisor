# Cost-Aware Refinement System

Default to the most cost-effective architecture, then dynamically refine based on a minimal set of high-impact questions.

---

## Phase 1 — Default Mode (No Input)

When no user input is provided, assume:

| Assumption | Default |
|------------|---------|
| Traffic | Low to moderate |
| Environment | Cost-sensitive |
| Team | Small |
| Compliance | No strict requirements |

### Cost-Efficient Baseline Architecture

- **Compute**: Prefer serverless (Lambda, API Gateway) where applicable
- **Database**: Managed services (RDS, DynamoDB, S3)
- **Orchestration**: Avoid EKS unless justified; prefer ECS Fargate or Lambda
- **Networking**: Minimize NAT; prefer VPC endpoints (S3, DynamoDB, ECR)
- **Scaling**: Autoscaling; on-demand resources
- **Availability**: Single-AZ acceptable for non-critical workloads

**Label**: "This is a cost-optimized baseline architecture based on minimal assumptions."

---

## Phase 2 — Refinement Questions

Use the [cloud-architecture-client-questionnaire.md](cloud-architecture-client-questionnaire.md) for the full prompt. After baseline output, present exactly these 6 questions:

| # | Question | Options |
|---|----------|---------|
| 1 | **Traffic pattern** | Low / Moderate / High / Spiky |
| 2 | **Availability requirement** | Best effort / 99.9% / 99.99%+ |
| 3 | **Data criticality** | Non-critical / Important / Mission-critical |
| 4 | **Security/compliance level** | Basic / Moderate / High / Regulated |
| 5 | **Team size / expertise** | Solo / Small / Platform team |
| 6 | **Cost priority** | Aggressive savings / Balanced / Performance-first |

---

## Phase 3 — Adaptive Architecture

Adjust recommendations based on answers. Refine: compute model, network design, database choice, observability depth, backup/DR level, **monthly cost range**.

### Compute Adjustments

| Answer | Adjustment |
|--------|------------|
| Traffic: Low/Moderate | Lambda, ECS Fargate (on-demand) |
| Traffic: High/Spiky | ECS with ASG; consider Reserved/Spot for steady base |
| Availability: 99.99%+ | Multi-AZ; consider EKS for complex HA |
| Team: Solo/Small | Lambda, ECS Fargate; avoid EKS |
| Team: Platform team | EKS viable if orchestration needed |
| Cost: Aggressive | Lambda; single-AZ; VPC endpoints; Spot |
| Cost: Performance-first | ECS/EKS; Multi-AZ; Reserved; larger instances |

### Networking Adjustments

| Answer | Adjustment |
|--------|------------|
| Availability: Best effort | Single-AZ acceptable |
| Availability: 99.9%+ | Multi-AZ; private subnets |
| Compliance: Regulated | Private endpoints; Zero Trust segmentation |
| Cost: Aggressive | VPC endpoints; minimize NAT |

### Storage Adjustments

| Answer | Adjustment |
|--------|------------|
| Data: Non-critical | S3 Standard; single-AZ RDS for dev |
| Data: Important | S3 IA; RDS Multi-AZ for prod |
| Data: Mission-critical | Multi-region; Aurora Global; cross-region backup |

### Security Adjustments

| Answer | Adjustment |
|--------|------------|
| Compliance: Basic | Standard IAM; TLS; no rotation required |
| Compliance: Moderate | Least privilege; Secrets Manager; rotation |
| Compliance: High/Regulated | Zero Trust; audit logging; NIST controls; MFA |

### Cost Posture

| Answer | Posture |
|--------|---------|
| Aggressive savings | Lambda; single-AZ; Spot; endpoints; no Reserved |
| Balanced | Managed services; Multi-AZ prod; Reserved for steady |
| Performance-first | Larger instances; Multi-AZ; Reserved; CDN |

---

## Output Requirements

Produce in order:

1. **Baseline cost-optimized architecture** — With label
2. **Question set** — The 6 questions
3. **Refined architecture** — After user answers (or note "awaiting answers")
4. **Delta explanation** — What changed, why, cost impact, risk impact

### Delta Summary Format

| Change | What | Why | Cost Impact | Reliability Impact | Ops Complexity Impact |
|--------|------|-----|-------------|---------------------|------------------------|
| Compute | Lambda → ECS | High traffic | + | + | + |
| Networking | Single-AZ → Multi-AZ | 99.9% SLA | + | Lower risk | Same |
| ... | ... | ... | ... | ... | ... |

**Delta Summary**: What changed, why it changed, cost impact, reliability impact, operational complexity impact.

**Full output** (per questionnaire): Refined assumptions, updated architecture, what changed, cost impact, reliability impact, security impact, complexity/ops impact.

---

## Rules

- Always start simple and cost-efficient
- Increase complexity ONLY when justified
- Avoid over-engineering for small teams
- Highlight cost vs reliability tradeoffs
- Prefer managed services unless constraints demand otherwise
