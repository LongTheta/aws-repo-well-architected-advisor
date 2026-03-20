---
name: aws-repo-scaffolder
description: Scaffolds AWS infrastructure repos from architecture decisions or review findings. Takes architecture summary, recommended services, and remediation plan as input; produces Terraform or CDK scaffolding with required tags, security defaults, and CI/CD skeleton. Use when user wants to build from design output, generate IaC from findings, or scaffold a new repo.
risk_tier: 1
---

# AWS Repo Scaffolder

Scaffolds AWS infrastructure repos from architecture decisions or review findings. **Bridges design/review → implementation.**

## When to Use

- User has architecture design output and wants to start building
- User has review findings and wants IaC scaffolding that addresses them
- User says: "scaffold from this design", "generate Terraform from these findings", "build the repo"
- **Incremental fix mode**: Existing repo with gaps; user wants patch-style fixes, not full rebuild

## Input

- Architecture summary (compute, data, networking, IAM)
- **infrastructure_config** from solution-discovery (REQUIRED when available):
  - `tags`: project, environment, owner, cost_center, data_classification, lifecycle_stage, custom_tags
  - `networking`: vpc_cidr, az_count, cidr_constraints
  - `roles`: CI, developer, auditor, platform admin
  - `region`, `enable_vpc_flow_logs`
- Recommended AWS services
- Remediation plan (if from review)
- Preferred IaC: Terraform or CDK

## Output

- Repo structure (directories, files)
- Terraform or CDK scaffolding for recommended services
- **tfvars templates**: `dev.tfvars.example`, `stage.tfvars.example`, `prod.tfvars.example` — template-style with `ADD_VALUE_HERE` and `REPLACE_WITH_SECURE_PASSWORD`; never guess customer values. See `docs/terraform-tfvars-templates.md`.
- Required tags on all resources
- Security defaults (private subnets, no 0.0.0.0/0, Secrets Manager for creds)
- CI/CD skeleton (GitHub Actions or GitLab CI)
- README with setup instructions

## Complete Infrastructure Checklist

Scaffold output MUST include all of the following for a fully functioning secure AWS infrastructure:

| Component | Required | Purpose |
|-----------|----------|---------|
| VPC | ✓ | Network isolation |
| Public subnets | ✓ | ALB, NAT; tag `kubernetes.io/role/elb` for EKS |
| Private subnets | ✓ | Workloads, RDS; tag `kubernetes.io/role/internal-elb` for EKS |
| Route tables | ✓ | Public (IGW), private (NAT) |
| Internet Gateway | ✓ | Public egress |
| NAT Gateway | ✓ | Private subnet egress |
| Security groups | ✓ | RDS, ALB, EKS; least privilege, no 0.0.0.0/0 on DB |
| KMS keys | ✓ | Secrets Manager, RDS; customer-managed, rotation enabled |
| IAM / IRSA | ✓ | ESO, Load Balancer Controller, ECR push for CI |
| VPC Flow Logs | ✓ | Network audit (optional but recommended) |

Adapt compute (EKS/ECS/Lambda), data (RDS/DynamoDB/S3), and ingress per application type.

**When infrastructure_config is provided:** Use its values for variables.tf (project, environment, owner, cost_center, vpc_cidr, etc.) and default_tags. Generate IAM roles/policies for each role in infrastructure_config.roles.

## Incremental Fix Mode (Existing Repos)

When fixing an existing repo (not greenfield):

- Prefer minimal targeted fixes over full rebuilds
- Generate patch-style changes: Terraform patches, IAM corrections, CI/CD updates, security fixes
- Each fix MUST include: risk_reduction, affected_control_area, effort, priority, evidence_required_to_close
- Output per schemas/incremental-fix.schema.json

## Rules

- Include all 8 required tags: Project, Environment, Owner, CostCenter, ManagedBy, Purpose, DataClassification, Lifecycle
- No hardcoded secrets; use variables or Secrets Manager references
- No 0.0.0.0/0 on sensitive resources (DB, internal services)
- No wildcard IAM; use least-privilege placeholders
- Mark output as scaffolding — user must review before apply

## Files in This Skill

| File | Purpose |
|------|---------|
| `SKILL.md` | This file |
| `README.md` | Overview, usage |
| `scaffold-prompt.md` | Template prompt to paste |
| `example-input.md` | Sample architecture + findings input |
| `example-output.md` | Sample Terraform scaffolding |
