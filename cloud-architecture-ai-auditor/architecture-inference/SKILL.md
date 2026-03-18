---
name: architecture-inference
description: Infers current-state AWS architecture from repository artifacts (IaC, K8s, CI/CD). Maps compute, storage, networking, databases, eventing. Outputs architecture diagram and assumptions. Use after repo-discovery in cloud architecture review.
risk_tier: 1
---

# Architecture Inference

Infers current-state AWS architecture from discovered repository artifacts.

## When to Use

- Second step in full architecture review (after repo-discovery)
- User asks to infer or map current architecture
- Need architecture diagram for assessment

## Input

- Artifact inventory from repo-discovery
- IaC files (Terraform, CDK, CloudFormation)
- Kubernetes manifests
- CI/CD configs

## Inference Targets

| Component | What to Extract | Evidence Sources |
|-----------|----------------|------------------|
| **Compute** | EC2, ECS, EKS, Lambda, Fargate | aws_instance, aws_ecs_service, aws_lambda_function |
| **Storage** | S3, EBS | aws_s3_bucket, aws_ebs_volume |
| **Database** | RDS, DynamoDB, Aurora | aws_db_instance, aws_dynamodb_table |
| **Networking** | VPC, subnets, ALB, NAT | aws_vpc, aws_subnet, aws_lb |
| **Eventing** | SQS, SNS, EventBridge | aws_sqs_queue, aws_sns_topic |
| **Account** | Single/multi, region | provider blocks, assume-role |
| **Integration** | API Gateway, etc. | aws_apigatewayv2_api |

## Output Format

```markdown
## Inferred Architecture

[ASCII or Mermaid diagram]

**Assumptions**:
- [Assumption 1] (Observed / Inferred / Missing Evidence)
- [Assumption 2] (Observed / Inferred / Missing Evidence)
```

## Rules

- Tag assumptions as Observed / Inferred / Missing Evidence
- Call out unknowns clearly
- Do not fabricate components without evidence
