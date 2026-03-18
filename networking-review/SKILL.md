---
name: networking-review
description: Reviews VPC design, subnets, security groups, ingress/egress, and hybrid connectivity per AWS Hybrid Networking Lens. Use when assessing VPC, subnets, NAT, load balancers, or network segmentation.
risk_tier: 1
---

# Networking Review

Specialist skill for network architecture assessment. Evaluates VPC design, segmentation, and connectivity per AWS Hybrid Networking Lens.

## When to Use

- User asks for networking review, VPC assessment, or network segmentation check
- User mentions subnets, security groups, NAT, load balancers, VPC endpoints
- Focused networking evaluation (invoked by orchestrator or standalone)

## Evaluation Domains

### VPC & Subnet Design

- CIDR design, subnet tiers (public/private/data)
- AZ distribution
- Route tables

### Ingress & Egress

- ALB/NLB, security groups, NACLs
- NAT Gateway, internet gateway
- VPC endpoints (interface, gateway)
- 0.0.0.0/0 exposure

### Hybrid Connectivity

- Direct Connect, VPN
- Transit Gateway
- Cross-account/region

### Zero Trust / Segmentation

- Deny by default
- Micro-segmentation
- Private endpoints vs public services

## Output Format

1. Networking score (0–10)
2. Top networking findings
3. VPC/subnet topology summary
4. Ingress/egress assessment
5. Recommendations (VPC endpoints, segmentation)

## Evidence Labels

Observed / Inferred / Missing Evidence

## Additional Resources

- [reference.md](reference.md)
- [sample-output-report.md](sample-output-report.md)
- [prompt-template.md](prompt-template.md)
