---
name: finops-cost-optimizer
description: Analyzes IaC, cloud configs, and application architecture to identify cost inefficiencies and recommend optimized AWS architectures. Covers AWS Cost Optimization Pillar, FinOps Foundation principles. Use when optimizing cloud costs, identifying waste, or designing cost-effective AWS architectures.
risk_tier: 1
---

# FinOps Cost Optimizer

Analyzes infrastructure-as-code, cloud configurations, and application architecture to identify cost inefficiencies and recommend optimized, cost-effective AWS architectures.

## When to Use

- User asks to optimize cloud costs, identify waste, or reduce AWS spend
- User mentions FinOps, cost optimization, or cost-effective architecture
- User wants to evaluate EC2, ECS, EKS, Lambda, S3, RDS, NAT, or data transfer costs
- User needs savings opportunities or alternative architecture recommendations

## Frameworks

| Framework | Scope |
|-----------|-------|
| **AWS Cost Optimization Pillar** | Well-Architected Framework cost best practices |
| **FinOps Foundation** | Cost allocation, unit economics, visibility, optimization cadence |

## Evaluation Domains

### 1. Compute Cost

- EC2 instance types and sizing
- Overprovisioned resources
- Lack of autoscaling
- ECS/EKS vs Lambda opportunities
- Idle environments

### 2. Network Cost

- NAT Gateway usage (high cost risk)
- Cross-AZ traffic
- Load balancer count
- Data transfer patterns

### 3. Storage Cost

- S3 storage classes
- Lifecycle policies
- EBS overprovisioning
- Snapshot retention

### 4. Database Cost

- RDS instance sizing
- Multi-AZ usage vs need
- Serverless vs provisioned
- Idle databases

### 5. Kubernetes Cost (if present)

- Node sizing inefficiency
- Pod over-allocation
- Lack of cluster autoscaler
- Missing spot instances

### 6. CI/CD Cost

- Runner inefficiency
- Excessive pipeline runs
- Artifact storage growth

### 7. Tagging & Visibility

- Missing cost allocation tags
- Lack of cost tracking by environment/team

## Review Modules (Run in Order)

1. **Repo Discovery** — IaC, cloud configs, K8s manifests, CI/CD configs
2. **Compute Review** — EC2, ECS, EKS, Lambda; sizing, autoscaling, idle
3. **Network Review** — NAT, cross-AZ, load balancers, data transfer
4. **Storage Review** — S3 classes, lifecycle, EBS, snapshots
5. **Database Review** — RDS sizing, Multi-AZ, serverless
6. **Kubernetes Review** (if present) — Node sizing, pod allocation, autoscaler, spot
7. **CI/CD Review** — Runners, pipeline runs, artifact storage
8. **Tagging Review** — Cost allocation tags, visibility
9. **Gap Analysis & Recommendations** — Waste, savings, alternative architectures

## Mandatory Rules

- **Always recommend cheaper alternatives when possible**
- **Balance cost vs reliability and security** — do not sacrifice critical resilience
- **Flag "over-engineered architecture" scenarios**
- **Do not sacrifice critical resilience for cost savings**

## Output Format

Produce the report in this order. See [sample-output-report.md](sample-output-report.md) for a full example.

```markdown
# FinOps Cost Optimization — [Repo Name]

## 1. Cost Efficiency Score (0–10)
[Overall score with rationale]

## 2. Top Cost Drivers (Ranked)
[Ranked by estimated spend impact]

## 3. Estimated Waste Categories
| Category | Compute | Network | Storage | CI/CD |
|----------|---------|---------|---------|-------|
| ... | ... | ... | ... | ... |

## 4. High-Impact Savings Opportunities
### Quick Wins (low effort)
### Medium Optimizations
### Architectural Changes

## 5. Alternative Architecture Recommendations
[Replace EC2 → serverless; NAT → VPC endpoints; reduce AZ/data transfer; etc.]

## 6. Estimated Savings Impact
| Opportunity | Impact: Low (<10%) / Medium (10–30%) / High (30%+) |

## 7. FinOps Maturity Level
**Level**: Crawl / Walk / Run
[Rationale]
```

## Additional Resources

- [reference.md](reference.md) — Cost drivers, evidence sources, AWS cost patterns
- [sample-output-report.md](sample-output-report.md) — Full example with recommendations
- [prompt-template.md](prompt-template.md) — Invocation template
