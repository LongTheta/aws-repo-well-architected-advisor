# Infrastructure & Governance Questionnaire

**Use after or alongside aws-app-platform-questionnaire.** Collects tagging, networking, and IAM role requirements so the scaffold produces a fully customized infrastructure.

---

## When to Ask

- During `/solution-discovery` or `/design-and-implement`
- Before generating Terraform — these values flow into variables.tf and resource tags

---

## Area 1: Tagging (Required for All Resources)

Ask the user for each. Provide sensible defaults if they prefer to skip.

| Question | Variable | Example | Purpose |
|----------|----------|---------|---------|
| Project name? | `project` | my-app, order-service | Resource naming, cost allocation |
| Environment(s)? | `environment` | dev, staging, prod | Separate infra per env |
| Owner or team? | `owner` | platform-team, acme-corp | Accountability |
| Cost center? | `cost_center` | engineering, product-123 | FinOps, chargeback |
| Data classification? | `data_classification` | internal, confidential, public | Compliance, handling |
| Lifecycle stage? | `lifecycle_stage` | development, production | Retention, policies |
| Custom tags? | `custom_tags` | { "Tier": "web", "Backup": "daily" } | Org-specific |

**Output:** All 8 required tags + any custom tags for Terraform `default_tags` and resource-specific tags.

---

## Area 2: Networking (CIDR & Subnets)

| Question | Variable | Example | Purpose |
|----------|----------|---------|---------|
| VPC CIDR block? | `vpc_cidr` | 10.0.0.0/16 | Must not overlap with on-prem or other VPCs |
| Existing IP constraints? | `cidr_constraints` | Must avoid 10.1.0.0/16 (peering) | Prevent overlap |
| Number of AZs? | `az_count` | 2 or 3 | High availability |
| Subnet sizing preference? | `subnet_strategy` | /20 per subnet, /24 for small | IP capacity |

**Defaults if not specified:**
- `vpc_cidr`: 10.0.0.0/16
- `az_count`: 2
- Subnets: derived from VPC CIDR (public + private per AZ)

---

## Area 3: IAM Roles & Access

| Question | Roles to Create | Purpose |
|----------|-----------------|---------|
| Who deploys infrastructure? | `terraform_deployer` | IAM user/role for Terraform apply |
| Who runs CI/CD pipelines? | `ci_role` | GitHub Actions, GitLab CI — ECR push, EKS access |
| Who needs read-only access? | `auditor_role` | View resources, logs; no modify |
| Who needs developer access? | `developer_role` | EKS kubectl, RDS connect (if IAM auth) |
| Who is platform admin? | `platform_admin_role` | Full access to cluster, secrets |
| Any other roles? | `custom_roles` | e.g., data-scientist, support |

**Output:** List of roles with suggested policies (ECR push, EKS read, RDS connect, etc.). Scaffold generates IAM policies/roles in Terraform.

---

## Area 4: AWS Region & Environment-Specific

| Question | Variable | Example |
|----------|----------|---------|
| AWS region? | `aws_region` | us-east-1, eu-west-1 |
| Enable VPC Flow Logs? | `enable_vpc_flow_logs` | true (default) |
| Enable NAT Gateway (or NAT instance for dev)? | `nat_strategy` | nat_gateway, nat_instance |

---

## Invocation Prompt

```
I need infrastructure and governance details to build your AWS setup. Answer what you can; I'll use defaults for the rest.

**Tagging:**
- Project name?
- Environment(s)? (dev, prod, etc.)
- Owner/team?
- Cost center?
- Data classification? (internal, confidential, public)
- Any custom tags?

**Networking:**
- VPC CIDR? (e.g., 10.0.0.0/16) — any IP ranges to avoid?
- How many AZs? (2 or 3)

**Roles:**
- Who runs Terraform?
- Who runs CI/CD (GitHub Actions, etc.)?
- Who needs read-only/audit access?
- Who needs developer access (kubectl, DB)?
- Platform admin?

**Region:** us-east-1 or other?
```

---

## Output Format

After collecting, produce a structured block for the solution brief:

```yaml
infrastructure_config:
  tags:
    project: "..."
    environment: "..."
    owner: "..."
    cost_center: "..."
    data_classification: "..."
    lifecycle_stage: "..."
    custom_tags: {}
  networking:
    vpc_cidr: "10.0.0.0/16"
    az_count: 2
    cidr_constraints: []
  roles:
    - name: ci-push
      purpose: "CI/CD ECR push, EKS"
    - name: developer
      purpose: "kubectl, RDS connect"
    - name: auditor
      purpose: "Read-only"
  region: "us-east-1"
  enable_vpc_flow_logs: true
```

This block MUST be passed to `/platform-design` and `/scaffold` so the generated Terraform uses these values.
