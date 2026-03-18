# AWS Scope — This Repository Is AWS-Only

This repository is the **canonical AWS-specific implementation** of a broader multi-cloud platform design system. It is intentionally scoped to AWS only.

---

## In Scope

- **AWS Well-Architected** — Primary architecture framework (6 pillars)
- **AWS-native services** — Lambda, ECS, EKS, EC2, RDS, DynamoDB, S3, SQS, EventBridge, Step Functions, API Gateway, ALB, Route 53, CloudFront, Cognito, CloudWatch, etc.
- **AWS IaC** — Terraform (AWS provider), CDK, CloudFormation
- **AWS terminology** — VPC, subnets, security groups, IAM roles, etc.
- **EKS** — Kubernetes on AWS (when justified)

---

## Out of Scope

- **Azure** — No Azure services, ARM, or Azure-specific logic
- **GCP** — No GCP services, GKE, or GCP-specific logic
- **Multi-cloud** — This repo does not compare or recommend across clouds

---

## Rationale

- Focus enables depth and accuracy
- AWS Well-Architected is the primary framework
- Keeps decision logic and recommendations coherent
- Other cloud implementations (Azure, GCP) belong in separate repos

---

## LongTheta Ecosystem

This repo is the **AWS-first** platform design and review system. Other cloud implementations may exist as sibling repositories in the LongTheta ecosystem.
