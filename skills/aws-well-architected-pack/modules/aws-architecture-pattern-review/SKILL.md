---
name: aws-architecture-pattern-review
description: Recommends optimal AWS service choices and architecture patterns based on repo analysis. Identifies workload characteristics, detects anti-patterns, provides replacement architectures. Use when designing AWS architecture, choosing services, or right-sizing workloads.
risk_tier: 1
---

# AWS Architecture Pattern Review

Recommends optimal AWS service choices and architecture patterns based on repository analysis.

## Purpose

Evaluate service selection and patterns against AWS best practices. Identify anti-patterns, over-engineering, and suboptimal choices. Contribute to Performance Efficiency pillar scoring.

## Triggers

- User asks to recommend AWS services, architecture patterns, or right-size a workload
- User mentions Lambda vs ECS, RDS vs DynamoDB, over-engineered, or service selection
- Terraform, CDK, or CloudFormation present

## Inputs

- Artifact inventory
- Inferred architecture
- IaC files

## Review Questions

- Is compute choice appropriate for workload? (Lambda vs ECS vs EKS vs EC2)
- Is database choice appropriate? (RDS vs DynamoDB vs S3)
- Is there over-engineering? (EKS for simple app, Multi-AZ for dev)
- Are there anti-patterns? (public exposure, hardcoded secrets, missing autoscaling)
- What simpler or cheaper alternatives exist?

## Evidence to Look For

| Decision | Options | When to Recommend |
|----------|---------|-------------------|
| Compute | Lambda, ECS, EKS, EC2 | Lambda: event-driven, bursty; ECS: containers; EKS: K8s needed; EC2: full control |
| Database | RDS, DynamoDB, S3, Aurora | RDS: relational; DynamoDB: key-value; S3: object |
| Ingress | ALB, API Gateway, NLB | ALB: HTTP/HTTPS; API Gateway: APIs; NLB: TCP/UDP |
| Egress | NAT Gateway, VPC endpoints | Endpoints: S3, DynamoDB (cheaper); NAT: internet |

| Anti-Pattern | What to Flag |
|--------------|--------------|
| Over-engineered | EKS for simple app; Multi-AZ for dev |
| Public exposure | Private services in public subnet |
| Overuse of EC2/K8s | EC2/EKS for Lambda-suitable workload |
| Missing autoscaling | Fixed capacity, no scale-in |
| Hardcoded secrets | Secrets in code/config |

## Scoring Contribution

- **Performance Efficiency** (10% weight): Service fit, right-sizing, anti-pattern count

## Expected Output

- Current architecture assessment
- Anti-pattern detection list
- Recommended architecture pattern per component
- Cost/security/reliability improvement table
- Right-sized architecture suggestion with rationale
