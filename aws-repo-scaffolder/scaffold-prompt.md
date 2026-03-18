# Scaffold Prompt Template

Copy and paste this prompt, replacing the placeholders with your architecture summary and findings.

---

## Prompt

```
Use the aws-repo-scaffolder skill.

I have the following architecture design / review output. Scaffold a new AWS infrastructure repo.

## Architecture Summary
[Paste your architecture summary here. Include: compute (Lambda/ECS/EKS/EC2), data (RDS/DynamoDB/S3), networking (VPC, subnets), IAM approach]

## Recommended Services
[Paste the recommended AWS services list]

## Remediation Plan (if from review)
[Paste any required fixes: e.g., remove wildcard IAM, restrict DB access, add tags, enable CloudTrail]

## Preferences
- IaC: [Terraform | CDK]
- CI/CD: [GitHub Actions | GitLab CI]
- Project name: [e.g., order-service]

Generate:
1. Repo directory structure
2. Terraform/CDK files with the recommended services
3. All 8 required tags on resources
4. Security defaults (private subnets for DB, no 0.0.0.0/0, Secrets Manager for credentials)
5. CI/CD pipeline skeleton
6. README with setup instructions

Mark output as scaffolding. I will review before applying.
```

---

## Short Form (After Review)

If you already have a review report in context:

```
Scaffold an AWS repo from the architecture and remediation plan above. Use Terraform. Include required tags and security defaults.
```
