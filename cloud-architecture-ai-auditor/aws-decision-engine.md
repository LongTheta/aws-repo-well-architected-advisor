# AWS Decision Engine

Rule-based decision logic derived from AWS whitepapers and best practices. Apply when recommending service choices and detecting anti-patterns.

## Compute Selection (Lambda vs ECS vs EKS vs EC2)

| Workload Characteristic | Recommendation | Why |
|-------------------------|----------------|-----|
| Event-driven, stateless, < 15 min | **Lambda** | No infra; pay per request; auto-scale; managed |
| Containerized, moderate complexity | **ECS Fargate** | Managed; no node management; scale tasks |
| K8s ecosystem required (multi-cluster, K8s API) | **EKS** | Full K8s; only when orchestration complexity justified |
| Full control, predictable, long-running | **EC2** | Flexibility; Reserved/Spot; self-managed |
| Batch, sporadic, fault-tolerant | **Lambda or Fargate Spot** | Cost-effective for burst workloads |

**Rule**: Recommend EKS only when orchestration complexity is justified. Prefer ECS or Lambda for simpler workloads.

## Networking

| Scenario | Recommendation | Why |
|----------|----------------|-----|
| Egress to S3, DynamoDB, ECR | **VPC endpoints** over NAT | No NAT data transfer cost; private connectivity |
| Internet egress required | **NAT Gateway** (minimize via endpoints) | Required for outbound; use endpoints first |
| Multi-AZ HA | **Subnets in 2+ AZs** | Resilience |
| Public-facing API | **ALB** | L7; path routing; WAF |
| Lambda backend API | **API Gateway** | Managed; throttling; auth |

## Storage & Database

| Need | Recommendation | Why |
|------|----------------|-----|
| Relational, ACID | **RDS / Aurora** | Managed; familiar |
| Key-value, scale | **DynamoDB** | Serverless; single-digit ms |
| Object storage | **S3** | Durable; lifecycle; cheap |
| Variable relational load | **Aurora Serverless v2** | Scale to zero; pay per use |

## High Availability

| Component | Recommendation | Why |
|-----------|----------------|-----|
| Production database | **Multi-AZ RDS/Aurora** | Automatic failover |
| Production compute | **Multi-AZ ECS/EKS/EC2** | No single point of failure |
| Dev/Stage database | **Single-AZ** (if acceptable) | Cost reduction |
| Load balancer | **ALB/NLB** | Health checks; multi-AZ |

## Anti-Patterns to Detect

| Anti-Pattern | Detection | Recommendation |
|--------------|-----------|----------------|
| **Public exposure of backend** | App/DB in public subnet; 0.0.0.0/0 SG | Move to private; restrict SG |
| **Overuse of Kubernetes** | EKS for simple app | ECS Fargate or Lambda |
| **Hardcoded secrets** | .env, variables.tf with secrets | Secrets Manager, Parameter Store |
| **Lack of autoscaling** | desired_count fixed; min=max | Add ASG scale-in; ECS scaling |
| **Missing logging/monitoring** | No CloudWatch; no alarms | Add logs, metrics, alerts |
| **Excessive NAT cost** | NAT for S3/DynamoDB traffic | VPC endpoints |
| **Over-provisioned compute** | Large instances for low load | Right-size; consider serverless |
| **No cost allocation tags** | Missing Environment, Project | Add tags to all resources |

## Prefer Managed Services

| Self-Managed | Prefer | Why |
|--------------|--------|-----|
| EC2 + self-managed DB | RDS | Patching; backups; HA |
| EC2 for event processing | Lambda | No servers; scale |
| Self-hosted queue | SQS | Managed; durable |
| Manual cert management | ACM | Free; auto-renewal |

## Over-Engineering Detection

- **EKS for single app** → ECS or Lambda
- **Multi-AZ in dev** → Single-AZ
- **NAT per AZ when endpoints suffice** → VPC endpoints
- **Multiple ALBs for same domain** → Path-based routing on single ALB
- **Provisioned DynamoDB for sporadic** → On-demand
