---
name: aws-architecture-pattern-advisor
description: Recommends optimal AWS service choices and architecture patterns based on repo analysis. Uses AWS whitepapers, reference architectures. Identifies workload characteristics, recommends Lambda/ECS/EKS/EC2, RDS/DynamoDB/S3, detects anti-patterns, provides replacement architectures. Use when designing AWS architecture, choosing services, or right-sizing workloads.
risk_tier: 1
---

# AWS Architecture Pattern Advisor

Uses AWS whitepapers, service documentation, and reference architectures to recommend optimal AWS service choices and architecture patterns based on repository analysis.

## When to Use

- User asks to recommend AWS services, architecture patterns, or right-size a workload
- User mentions Lambda vs ECS, RDS vs DynamoDB, over-engineered, or service selection
- User wants alternative architecture (simpler, cheaper, more secure)

## Workflow

### 1. Identify Workload Characteristics

| Characteristic | Options | Evidence Sources |
|----------------|---------|------------------|
| **Stateless vs stateful** | Stateless, stateful, hybrid | App code, session handling, caching |
| **Event-driven vs request-driven** | Event (async), request (sync), hybrid | Triggers, API patterns, queues |
| **Traffic patterns** | Steady, bursty, sporadic | Scaling config, usage patterns |
| **Compute intensity** | Light, moderate, heavy | CPU/memory config, runtime |
| **Data persistence** | None, ephemeral, durable | Storage, DB usage |

### 2. Recommend Service Choices

| Decision | Options | When to Recommend |
|----------|---------|-------------------|
| **Compute** | Lambda, ECS, EKS, EC2 | Lambda: event-driven, bursty; ECS: containers, steady; EKS: K8s needed; EC2: full control |
| **Database** | RDS, DynamoDB, S3, Aurora | RDS: relational; DynamoDB: key-value, scale; S3: object; Aurora: MySQL/Postgres scale |
| **Ingress** | ALB, API Gateway, NLB | ALB: HTTP/HTTPS; API Gateway: APIs, Lambda; NLB: TCP/UDP, low latency |
| **Egress** | NAT Gateway, VPC endpoints | Endpoints: S3, DynamoDB, ECR (cheaper); NAT: internet egress |

### 3. Detect Anti-Patterns

| Anti-Pattern | What to Flag | Evidence |
|--------------|--------------|----------|
| Over-engineered | EKS for simple app; Multi-AZ for dev | K8s manifests; RDS multi_az |
| Public exposure | Private services in public subnet | Subnet, SG rules |
| Overuse of EC2/K8s | EC2/EKS for Lambda-suitable workload | Compute type, traffic pattern |
| Missing autoscaling | Fixed capacity, no scale-in | ASG min=max; no HPA |
| Hardcoded secrets | Secrets in code/config | env files, .tf variables |

### 4. Provide Replacement Architecture

For each anti-pattern or suboptimal choice, provide:

- **Simpler alternative** — Reduce complexity
- **Lower-cost alternative** — Reduce spend
- **More secure alternative** — Improve security

Include: reasoning, tradeoffs (cost, complexity, performance), Well-Architected pillar alignment.

## Mandatory Rules

- **Prefer managed services when appropriate** — Lambda, RDS, DynamoDB over self-managed
- **Avoid unnecessary complexity** — EKS only when K8s is required
- **Always include a cost-aware option** — Reserved, Spot, serverless where viable
- **Clearly explain WHY** — Every recommendation must have rationale

## Output Format

```markdown
# AWS Architecture Pattern Assessment — [Repo Name]

## 1. Current Architecture Assessment
[Workload characteristics; inferred architecture; service inventory]

## 2. Anti-Pattern Detection
[Over-engineered, public exposure, overuse of EC2/K8s, missing autoscaling, hardcoded secrets]

## 3. Recommended Architecture Pattern
[Per component: recommended service, reasoning, tradeoffs]

## 4. Cost / Security / Reliability Improvements
[Table: current → recommended, impact, pillar alignment]

## 5. Right-Sized Architecture Suggestion
[Concrete target architecture with WHY for each choice]
```

## Additional Resources

- [reference.md](reference.md) — Service selection matrix, anti-patterns, tradeoffs
- [sample-output-report.md](sample-output-report.md) — Full example
- [prompt-template.md](prompt-template.md) — Invocation template
