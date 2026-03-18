# Architecture Decision Engine — Example Inputs

Two example inputs: **Spec-Driven** (incomplete requirements) and **Repo-Driven** (existing IaC).

---

## Example 1: Spec-Driven — Small Startup

### Initial User Statement

> "We're building a task management app. Small team, 3 developers. We need it live in 2 months. Budget is tight."

### Incomplete Information (Skill Asks Questions)

The skill does NOT assume. It asks:

**Product / Business**
- What problem are we solving? → Task management for small teams
- Who are the users? → 10–500 teams initially
- Expected traffic? → ~1,000 daily active users at launch
- Latency sensitivity? → Sub-second for UI; async OK for background
- Downtime acceptable? → Brief maintenance windows OK for MVP

**Scale**
- MVP vs production? → MVP first; scale later
- Burst or steady? → Steady with occasional spikes
- Expected growth? → 2–3x in first year

**Budget**
- Monthly budget target? → $100–$300
- Cost sensitivity? → High

**Data**
- Type? → Relational (tasks, projects, users)
- Data size? → Small; < 10 GB
- Compliance? → None for MVP

**Security**
- Public vs private? → Public SaaS
- Regulated? → No
- Sensitivity? → Low; no PII beyond email

**Team**
- DevOps maturity? → Low; prefer managed services
- Manage infra? → Prefer minimal
- Serverless simplicity? → Yes

---

## Example 2: Spec-Driven — Enterprise System

### Initial User Statement

> "We need to migrate our order processing system to AWS. High volume, regulated, must be reliable."

### Incomplete Information (Skill Asks Questions)

**Product / Business**
- What problem? → Order processing; payment handling
- Users? → Internal + B2B partners
- Traffic? → 50,000 orders/day; peaks to 200K
- Latency? → < 500ms for API; batch OK for reports
- Downtime? → Minimal; 99.9% target

**Scale**
- MVP vs production? → Production from day one
- Burst or steady? → Burst during promotions
- Growth? → 20% YoY

**Budget**
- Monthly target? → $5,000–$15,000
- Cost sensitivity? → Medium; reliability over cost

**Data**
- Type? → Relational; strong consistency required
- Size? → 100+ GB; growing
- Compliance? → PCI-DSS; audit required

**Security**
- Public vs private? → Hybrid; API public; DB private
- Regulated? → Yes; PCI
- Sensitivity? → High; payment data

**Team**
- DevOps maturity? → High
- Manage infra? → Yes; have platform team
- Serverless? → Open; prefer control

---

## Example 3: Repo-Driven — Existing Terraform

### Repo Structure

```
infra/
├── main.tf
├── variables.tf
├── vpc.tf
├── rds.tf
├── ecs.tf
└── iam.tf
```

### main.tf (excerpt)

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"
  # ...
}

resource "aws_db_instance" "main" {
  engine         = "postgres"
  instance_class = "db.t3.medium"
  allocated_storage = 100
  # ...
}

resource "aws_ecs_cluster" "app" {
  name = "order-service"
}

resource "aws_ecs_service" "app" {
  desired_count = 2
  launch_type   = "FARGATE"
  # ...
}
```

### User Request

> "We have this Terraform. We're considering moving to Lambda for cost. Evaluate our current setup and tell us if Lambda makes sense."

### What the Skill Receives

- Existing IaC (Terraform)
- Current architecture: ECS Fargate + RDS Postgres + VPC
- User question: Lambda vs ECS for cost

### Skill Behavior

- Infers: ECS Fargate, RDS, VPC, likely ALB
- Evaluates: Lambda vs ECS for this workload
- Considers: request pattern, cold starts, state, cost at current scale
- Outputs: recommendation with tradeoff analysis
