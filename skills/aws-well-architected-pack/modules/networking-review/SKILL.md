---
name: networking-review
description: Reviews VPC design, subnets, security groups, ingress/egress, and hybrid connectivity per AWS Hybrid Networking Lens. Use when assessing VPC, subnets, NAT, load balancers, or network segmentation.
risk_tier: 1
---

# Networking Review

Specialist skill for network architecture assessment per AWS Hybrid Networking Lens.

## Purpose

Evaluate VPC design, segmentation, ingress/egress, and Zero Trust alignment. Contribute to Security and Reliability scoring. Flag public exposure (0.0.0.0/0) as CRITICAL.

## Triggers

- User asks for networking review, VPC assessment, or network segmentation check
- File patterns: `vpc*.tf`, `*subnet*`, `*security_group*`
- Content patterns: `0.0.0.0/0`, `aws_eks_cluster`

## Inputs

- Artifact inventory
- Inferred architecture
- IaC files (VPC, subnets, security groups, NACLs)

## Review Questions

- Is CIDR design appropriate? Subnet tiers (public/private/data)?
- Is AZ distribution correct?
- Is ingress/egress properly restricted? Any 0.0.0.0/0?
- Are VPC endpoints used for AWS services? (cheaper than NAT)
- Is there deny-by-default, micro-segmentation?

## Evidence to Look For

| Domain | Evidence |
|--------|----------|
| VPC & Subnet | CIDR, subnet tiers, AZ distribution, route tables |
| Ingress/Egress | ALB/NLB, security groups, NACLs, NAT Gateway, IGW, VPC endpoints |
| Public exposure | 0.0.0.0/0, cidr_blocks |
| Hybrid | Direct Connect, VPN, Transit Gateway |
| Zero Trust | Deny by default, micro-segmentation, private endpoints |

## Scoring Contribution

- Feeds Security (20%) and Reliability (15%) via network design

## Expected Output

1. Networking score (0–10)
2. Top networking findings
3. VPC/subnet topology summary
4. Ingress/egress assessment
5. Recommendations (VPC endpoints, segmentation)
6. All findings tagged: evidence_type, confidence, severity
