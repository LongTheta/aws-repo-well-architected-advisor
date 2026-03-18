# AWS Platform Blueprint for Application

Design a full AWS platform for an application from the ground up. Use cost-effective defaults, strong security foundations, and practical upgrade paths.

---

## Design Rules

- **Start with the cheapest safe baseline**
- **Prefer managed services** where appropriate
- **Avoid over-engineering**
- **Do not recommend EKS** unless justified (K8s ecosystem, team expertise, workload needs)
- **Use clear upgrade paths** instead of designing for maximum scale on day one

---

## Scope

Design the platform to cover the following areas. For each, provide recommendations with justification, defaults, and when to deviate.

---

## 1. Account and Environment Model

- **Single account vs multi-account** — When to use each; tradeoffs
- **Dev / test / prod separation** — Namespaces, tags, or separate accounts
- **When to keep things simple** — Single account + tags for small teams
- **When to split environments** — Compliance, billing, blast radius

**Output:** Recommended model with reasoning; upgrade path to multi-account if needed.

---

## 2. Networking

- **VPC design** — CIDR, AZs, subnet layout
- **Public vs private subnets** — What goes where; ALB in public, compute in private
- **NAT Gateway minimization** — VPC endpoints for S3, ECR, SSM, etc.; when NAT is needed
- **VPC endpoints** — Which to add; cost vs data transfer savings
- **Load balancers** — ALB vs NLB; when to use each
- **DNS and routing** — Route 53, private hosted zones, service discovery

**Output:** VPC diagram (ASCII or Mermaid); subnet allocation; endpoint list.

---

## 3. IAM and Access

- **Human access model** — IAM users vs SSO/IdP; roles for developers
- **Workload IAM roles** — Task roles, instance profiles; least privilege
- **CI/CD roles** — Build, deploy, assume-role; pipeline permissions
- **Least privilege guidance** — No wildcards; resource-level where possible
- **Secrets access boundaries** — Who/what can read secrets; rotation

**Output:** Role matrix; permission boundaries; example policies.

---

## 4. Secrets and Encryption

- **Secrets Manager vs Parameter Store** — When to use each; rotation support
- **KMS usage** — Customer-managed keys; key policies
- **Encryption at rest** — RDS, S3, EBS defaults
- **Encryption in transit** — TLS; certificate management

**Output:** Secrets strategy; KMS key design; rotation approach.

---

## 5. Compute

- **Choose between Lambda, ECS, EKS, EC2** — Decision criteria
- **Justify the choice** based on:
  - Workload simplicity
  - Traffic pattern (low, moderate, high, spiky)
  - Team size and expertise
- **Default to simplest cost-effective safe option** — Lambda for event-driven; ECS Fargate for containers; EC2 only when needed

**Output:** Recommended compute with justification; when to switch (e.g., Lambda → ECS at scale).

---

## 6. Data Layer

- **Choose between RDS, DynamoDB, S3, ElastiCache, EFS** — Use case mapping
- **Include backup and recovery guidance** — RDS snapshots, S3 versioning, DynamoDB point-in-time
- **Retention and RTO/RPO** — Define based on data criticality

**Output:** Data store recommendations; backup strategy; recovery steps.

---

## 7. CI/CD

- **Source control integration** — GitHub, GitLab, CodeCommit
- **Build/test/deploy stages** — Pipeline structure
- **Promotion flow** — Dev → test → prod; manual gates for prod
- **Rollback strategy** — Blue/green, canary, or redeploy previous

**Output:** Pipeline diagram; stage definitions; promotion and rollback procedures.

---

## 8. Observability

- **Logs** — CloudWatch Logs; log groups; retention
- **Metrics** — CloudWatch Metrics; custom metrics; Golden Signals
- **Traces** — X-Ray or equivalent; sampling
- **Alerts** — SNS; PagerDuty/Opsgenie if needed
- **Dashboard recommendations** — What to track; example layout

**Output:** Observability stack; dashboard plan; alert thresholds.

---

## 9. Security Baseline

- **IAM guardrails** — SCPs (if multi-account); no root use; MFA
- **Network exposure review** — No 0.0.0.0/0 on backend; security groups
- **Audit logging** — CloudTrail; config delivery; retention
- **Vulnerability scanning** — ECR image scan; Inspector if EC2
- **Image/dependency scanning** — In CI; Trivy, Dependabot, etc.

**Output:** Security checklist; scanning integration points.

---

## 10. Cost Optimization

- **Cheapest safe baseline** — Minimal viable platform cost
- **Likely cost drivers** — NAT, RDS, compute, data transfer
- **Cheaper alternatives** — VPC endpoints, Reserved Capacity, Spot where appropriate
- **When to increase spend** — For reliability (Multi-AZ, DR) or scale (autoscaling, caching)

**Output:** Cost snapshot; top 3 drivers; optimization levers.

---

## 11. Growth Path

- **Initial platform** — What it looks like at day one
- **Moderate scale** — What to change (autoscaling, caching, Multi-AZ)
- **High scale** — What to change (multi-region, read replicas, sharding)

**Output:** Stage-by-stage upgrade path; triggers for each stage.

---

## Output Format

Produce the design in this order:

### 1. Executive Summary

- Platform overview
- Key design decisions
- Cost posture
- Security posture
- Recommended next steps

### 2. Baseline Platform Architecture

- Diagram (ASCII or Mermaid)
- Component list
- Data flow

### 3. Recommended AWS Services

| Category | Service | Justification |
|----------|---------|---------------|
| Compute | | |
| Data | | |
| Networking | | |
| Security | | |
| CI/CD | | |
| Observability | | |

### 4. Security Baseline

- IAM model
- Network model
- Secrets and encryption
- Audit and scanning

### 5. Cost Snapshot

- Estimated monthly range (band)
- Top 3 cost drivers
- Optimization opportunities

### 6. Risks and Tradeoffs

- Cost vs reliability
- Simplicity vs flexibility
- Security vs usability
- Performance vs cost

### 7. Upgrade Path by Growth Stage

| Stage | Triggers | Changes |
|-------|----------|---------|
| Initial | Day one | [baseline] |
| Moderate | [traffic, team, etc.] | [changes] |
| High | [scale, compliance] | [changes] |

### 8. Open Questions for Refinement

- Traffic expectations
- Availability target
- Data criticality
- Compliance requirements
- Team size and expertise
- Cost priority

---

## Invocation

```
Design a full AWS platform for [application description].

Use the aws-platform-blueprint-for-app prompt. Cover:
- Account and environment model
- Networking (VPC, subnets, NAT minimization, endpoints)
- IAM and access
- Secrets and encryption
- Compute (Lambda/ECS/EKS/EC2 with justification)
- Data layer (RDS/DynamoDB/S3/ElastiCache/EFS)
- CI/CD
- Observability
- Security baseline
- Cost optimization
- Growth path

Start with cheapest safe baseline. Avoid over-engineering. No EKS unless justified.
```
