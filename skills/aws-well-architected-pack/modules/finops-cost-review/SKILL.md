---
name: finops-cost-review
description: Analyzes IaC, cloud configs, and application architecture for cost inefficiencies. Identifies waste, recommends cheaper alternatives, flags over-engineering. Aligns with AWS Cost Optimization pillar and FinOps Foundation. Use when assessing cost posture, waste, or cost optimization.
risk_tier: 1
---

# FinOps Cost Review

Evaluates cost across AWS Cost Optimization pillar and FinOps Foundation practices.

## Purpose

Identify cost drivers, waste, and optimization opportunities. Recommend cheaper alternatives. Contribute to Cost Optimization pillar scoring. Flag missing tags as governance risk.

## Triggers

- User asks for cost analysis, waste identification, or cost optimization
- File patterns: Terraform, CDK, CloudFormation, Docker
- Content patterns: `aws_eks_cluster`, `aws_lambda_function`

## Inputs

- Artifact inventory
- Inferred architecture
- IaC files (compute, storage, network, database)

## Review Questions

- What are the top cost drivers? (compute, network, storage, database)
- Is NAT Gateway overused? Should VPC endpoints be used?
- Are instances right-sized? Autoscaling configured?
- Are cost allocation tags present on all resources?
- What cheaper alternatives exist? (Lambda vs ECS, Spot, Reserved)

## Evidence to Look For

| Domain | Evidence |
|--------|----------|
| Compute | EC2 sizing, overprovisioning, autoscaling, Lambda vs ECS |
| Network | NAT Gateway, VPC endpoints, cross-AZ traffic |
| Storage | S3 classes, lifecycle, EBS overprovisioning |
| Database | RDS sizing, Multi-AZ vs need, serverless |
| Tagging | Cost allocation tags, required tag set |

## Scoring Contribution

- **Cost Optimization** (15% weight): Score 0–10 based on waste, alternatives, tagging

## Expected Output

1. Cost efficiency score (0–10)
2. Top cost drivers (ranked)
3. Estimated waste categories
4. Savings opportunities (quick wins, medium, architectural)
5. Alternative architecture recommendations
6. Estimated savings impact (Low / Medium / High)
7. FinOps maturity level (Crawl / Walk / Run)
8. All findings tagged: evidence_type, confidence, severity
