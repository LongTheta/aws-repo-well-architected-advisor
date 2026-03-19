---
name: reliability-resilience-review
description: Reviews AWS Reliability pillar: multi-AZ, backups, RTO/RPO, fault isolation, auto-recovery. Evaluates RDS, ECS, Lambda, S3 durability, disaster recovery. Use when assessing availability, resilience, or disaster recovery posture.
risk_tier: 1
---

# Reliability & Resilience Review

Evaluates AWS Reliability pillar alignment: availability, fault tolerance, disaster recovery.

## Purpose

Assess multi-AZ deployment, backup automation, RTO/RPO, and fault isolation. Contribute to Reliability pillar scoring.

## Triggers

- User asks for reliability, resilience, or disaster recovery assessment
- Deep-review or regulated-review mode
- IaC present with RDS, ECS, EKS, S3, Lambda

## Inputs

- Artifact inventory
- Inferred architecture
- IaC files (RDS, ECS, EKS, S3, Lambda, backup configs)

## Review Questions

- Is compute multi-AZ? (EC2 ASG, ECS, EKS)
- Is RDS Multi-AZ for production?
- Is S3 versioning/cross-region replication configured?
- Are backups automated? Retention defined?
- Is RTO/RPO documented?
- Is restore testing evidenced?

## Evidence to Look For

| Domain | Evidence |
|--------|----------|
| Compute resilience | Multi-AZ, ASG health checks, Lambda concurrency |
| Data resilience | RDS Multi-AZ, read replicas, S3 versioning, DynamoDB PITR |
| Backup | Backup automation, retention, cross-region |
| Recovery | RTO/RPO docs, restore testing, DR runbooks |
| Fault isolation | Blast radius, circuit breakers, retries |

## Scoring Contribution

- **Reliability** (15% weight): Score 0–10 based on multi-AZ, backups, RTO/RPO evidence

## Expected Output

1. Reliability score (0–10)
2. Multi-AZ and backup assessment
3. RTO/RPO gaps
4. Top resilience findings
5. Remediation plan
6. All findings tagged: evidence_type, confidence, severity
