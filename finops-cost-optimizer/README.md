# FinOps Cost Optimizer

An AI skill that analyzes infrastructure-as-code, cloud configurations, and application architecture to identify cost inefficiencies and recommend optimized, cost-effective AWS architectures.

## Overview

This skill evaluates cost across:

| Framework | Scope |
|-----------|-------|
| **AWS Cost Optimization Pillar** | Well-Architected cost best practices |
| **FinOps Foundation** | Cost allocation, visibility, optimization cadence |

## Evaluation Domains

1. **Compute Cost** — EC2 sizing, overprovisioning, autoscaling, ECS/EKS vs Lambda, idle envs
2. **Network Cost** — NAT Gateway, cross-AZ traffic, load balancers, data transfer
3. **Storage Cost** — S3 classes, lifecycle, EBS overprovisioning, snapshot retention
4. **Database Cost** — RDS sizing, Multi-AZ vs need, serverless vs provisioned, idle DBs
5. **Kubernetes Cost** — Node sizing, pod over-allocation, cluster autoscaler, spot instances
6. **CI/CD Cost** — Runner inefficiency, pipeline runs, artifact storage
7. **Tagging & Visibility** — Cost allocation tags, tracking by environment/team

## Key Features

- **Cost efficiency score** (0–10)
- **Top cost drivers** (ranked)
- **Estimated waste categories** — Compute, Network, Storage, CI/CD
- **Savings opportunities** — Quick wins, medium, architectural
- **Alternative architecture recommendations** — EC2→serverless, NAT→VPC endpoints, etc.
- **Estimated savings impact** — Low (<10%), Medium (10–30%), High (30%+)
- **FinOps maturity level** — Crawl / Walk / Run

## Rules

- **Always recommend cheaper alternatives when possible**
- **Balance cost vs reliability and security**
- **Flag over-engineered architecture scenarios**
- **Do not sacrifice critical resilience for cost savings**

## Output

1. Cost efficiency score (0–10)
2. Top cost drivers (ranked)
3. Estimated waste categories
4. High-impact savings opportunities (quick wins, medium, architectural)
5. Alternative architecture recommendations
6. Estimated savings impact
7. FinOps maturity level

## Files in This Skill

| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill instructions |
| `README.md` | This overview |
| `reference.md` | Cost drivers, evidence sources |
| `sample-output-report.md` | Full example |
| `prompt-template.md` | Invocation template |

## Usage Example

```
Analyze my AWS infrastructure for cost optimization.
We use ECS, RDS, S3, and NAT Gateway.
Identify waste and recommend cheaper alternatives.
Do not sacrifice production resilience.
```
