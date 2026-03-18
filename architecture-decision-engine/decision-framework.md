# Architecture Decision Engine — Decision Framework

Detailed decision logic and tradeoffs for AWS architecture decisions.

---

## Compute Decision Tree

```
START
  │
  ├─ Need long-running (>15 min)? ──────────────────────────► ECS or EC2
  │
  ├─ Steady high traffic (10K+ req/day)? ───────────────────► ECS Fargate
  │
  ├─ Need full Kubernetes control? ────────────────────────► EKS
  │
  ├─ Small team, low ops preference? ─────────────────────► Lambda
  │
  ├─ Cost-sensitive, bursty traffic? ─────────────────────► Lambda
  │
  └─ Default for MVP / unknown scale ──────────────────────► Lambda (revisit later)
```

### Compute Tradeoffs

| Service | Best For | Ops | Cost (low traffic) | Cost (high traffic) |
|---------|----------|-----|--------------------|---------------------|
| **Lambda** | Event-driven, bursty, APIs | Very low | Low | Can get expensive |
| **ECS Fargate** | Containers, steady load | Medium | Medium | Lower than Lambda |
| **EKS** | Kubernetes, multi-cloud, complex orchestration | High | High | High |
| **EC2** | Full control, predictable load | High | Low (reserved) | Lowest at scale |

---

## Data Layer Decision Tree

```
START
  │
  ├─ Relational + ACID + joins? ───────────────────────────► RDS or Aurora
  │     ├─ Small scale, predictable ───────────────────────► RDS
  │     └─ Variable scale, auto-scale ─────────────────────► Aurora Serverless v2
  │
  ├─ Key-value / document / simple access? ─────────────────► DynamoDB
  │
  ├─ Blob / object storage? ───────────────────────────────► S3
  │
  ├─ Streaming / event log? ───────────────────────────────► Kinesis / EventBridge
  │
  └─ Caching? ─────────────────────────────────────────────► ElastiCache
```

### Data Tradeoffs

| Service | Best For | Consistency | Scaling | Cost (small) |
|---------|----------|-------------|---------|--------------|
| **RDS** | Relational, complex queries | Strong | Vertical | $15–50/mo |
| **Aurora** | Relational, high scale | Strong | Horizontal read replicas | $50+/mo |
| **DynamoDB** | Simple key-value, high scale | Configurable | Automatic | Pay-per-request |
| **S3** | Blobs, static assets | Eventually consistent | Unlimited | $2–10/mo |

---

## Networking Decision Tree

```
START
  │
  ├─ MVP, no compliance? ──────────────────────────────────► Default VPC
  │
  ├─ Multi-env, compliance, isolation? ─────────────────────► Custom VPC
  │     ├─ Public subnets: ALB, NAT
  │     ├─ Private subnets: App, DB
  │     └─ No 0.0.0.0/0 on DB or app
  │
  └─ Regulated / Zero Trust? ──────────────────────────────► Private subnets; VPC endpoints; no public DB
```

---

## IAM & Security Decision Tree

| Requirement | Recommendation |
|-------------|----------------|
| Lambda → RDS | Lambda execution role; VPC + security group; Secrets Manager for DB creds |
| Lambda → S3 | IAM role; least privilege; bucket policy |
| ECS → RDS | Task role; no instance profile for Fargate |
| EKS | IRSA (IAM Roles for Service Accounts) |
| Secrets | Secrets Manager or SSM Parameter Store (secure); never in code |
| Human access | IAM Identity Center (SSO) or Cognito; MFA for privileged |

---

## CI/CD Decision Tree

| Team Size | Recommendation |
|-----------|----------------|
| Small | GitHub Actions → CodeDeploy or direct Lambda deploy |
| Medium | CodePipeline + CodeBuild + CodeDeploy |
| Large | GitLab CI / GitHub Actions + Terraform Cloud / Argo CD |

**Environment promotion:** Dev → Staging → Prod. Manual approval for Prod. Never auto-approve Prod.

---

## Cost Strategy Tiers

| Tier | Target | Approach |
|------|--------|----------|
| **Low** | Minimize cost | Lambda, RDS micro, S3 standard, single-AZ, minimal redundancy |
| **Balanced** | Cost vs reliability | ECS or Lambda; Multi-AZ RDS; S3 + CloudFront; backup |
| **High-Resilience** | Reliability first | Multi-AZ; Aurora; WAF; GuardDuty; full observability |

---

## When to Override Defaults

| Signal | Override |
|--------|----------|
| Regulated (HIPAA, FedRAMP, PCI) | Custom VPC; private subnets; encryption; audit logging |
| High traffic | ECS Fargate over Lambda; Aurora over RDS |
| Long-running jobs | ECS or Lambda with longer timeout workaround |
| Complex queries | RDS/Aurora over DynamoDB |
| Team prefers Kubernetes | EKS (accept ops cost) |

---

## Anti-Patterns to Flag

| Pattern | Risk | Recommendation |
|---------|------|----------------|
| EKS for simple app | Over-engineering; high cost | Lambda or ECS |
| RDS publicly accessible | Security | Private subnet; no 0.0.0.0/0 |
| Wildcard IAM | Least privilege violation | Scoped permissions |
| Hardcoded secrets | Credential exposure | Secrets Manager |
| No backup strategy | Data loss risk | Automated backups; RPO/RTO defined |
| 0.0.0.0/0 on DB port | Critical exposure | Restrict to app VPC CIDR |
