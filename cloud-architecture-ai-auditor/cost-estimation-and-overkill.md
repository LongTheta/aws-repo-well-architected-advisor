# Cost Estimation & Over-Engineering Detection

Cost-aware Principal Architect behavior: estimate spend, detect overkill, recommend cheaper alternatives.

---

## 1. Monthly Cost Estimation Engine

### Cost Bands (Use Ranges, Not Fake Precision)

| Band | Approx. Monthly | Use When |
|------|-----------------|----------|
| **Very Low** | < $50 | Lambda-only; minimal S3; no NAT |
| **Low** | $50–$250 | Small ECS/Fargate; single RDS; basic ALB |
| **Moderate** | $250–$1,000 | Multi-AZ; NAT; moderate traffic |
| **High** | $1,000–$5,000 | EKS; multi-region; high traffic |
| **Very High** | $5,000+ | Enterprise; multi-account; heavy data |

### Categories & Drivers

| Category | Components | Cost Drivers |
|----------|------------|--------------|
| **Compute** | Lambda, EC2, ECS, EKS | Instance count, size, hours; Lambda invocations |
| **Networking** | NAT, ALB/NLB, data transfer, VPC endpoints | NAT hours; data GB; endpoint count |
| **Storage** | S3, EBS, EFS, snapshots | GB; class; retention |
| **Database** | RDS, Aurora, DynamoDB, ElastiCache | Instance size; Multi-AZ; RCU/WCU |
| **Observability** | CloudWatch, Prometheus, Grafana | Log GB; metric count; retention |
| **CI/CD** | Runners, artifact storage | Runner hours; storage GB |

### Estimation Labels

| Label | When to Use |
|-------|-------------|
| **Estimated from observed configuration** | IaC/config present; sizing known |
| **Estimated from inferred architecture** | Inferred from patterns; no explicit config |
| **Unknown due to missing usage data** | No traffic/usage info; cannot estimate |

**Rule**: Never pretend exact pricing is known from repos alone.

---

## 2. Cheaper-Alternative Recommendation Engine

For each major choice, suggest lower-cost alternative when appropriate.

| Current | Cheaper Alternative | Why Cheaper | Tradeoffs | Savings |
|---------|---------------------|-------------|-----------|---------|
| EC2 | Lambda | No idle; pay per request | Cold start; 15 min limit | High |
| EKS | ECS Fargate | No control plane; no node mgmt | Less K8s flexibility | High |
| NAT Gateway | VPC endpoints | No NAT data cost for AWS services | Endpoint limits | Medium–High |
| RDS Multi-AZ | Single-AZ (non-prod) | ~50% RDS cost | No failover | Medium |
| Always-on dev | Scheduled shutdown | 40–60% compute | No 24/7 dev | High |
| Large instance | Right-sized | Lower hourly | May need to monitor | Low–Medium |
| Self-managed observability | CloudWatch only | No self-host cost | Less flexibility | Medium |
| Multiple ALBs | Single ALB + path routing | One ALB cost | Shared ALB | Low–Medium |

### Output Format per Alternative

- **Recommendation** — What to use instead
- **Replaces** — Current choice
- **Why cheaper** — Brief rationale
- **Tradeoffs** — What you give up
- **Savings impact** — Low / Medium / High

---

## 3. Over-Engineering Detection

Flag when complexity exceeds apparent need.

| Pattern | Why Excessive | Simpler Alternative | Risk of Simplifying | Savings |
|---------|---------------|---------------------|---------------------|---------|
| EKS for simple CRUD | K8s overhead for low complexity | ECS Fargate or Lambda | Low | High |
| Multi-account for single team | Org overhead | Single account + tags | Low | Medium |
| Excessive microservices | Ops burden for simple app | Monolith or few services | Low | Medium |
| Multi-AZ with no criticality | Unnecessary HA cost | Single-AZ | Outage risk | Medium |
| Multiple load balancers | Redundant | Single ALB, path routing | Low | Low–Medium |
| NAT for low-complexity private | Endpoints suffice | VPC endpoints | Low | Medium |
| Complex CI/CD for basic service | Overkill stages | Simpler pipeline | Low | Low |
| Enterprise observability, minimal telemetry | Over-provisioned | CloudWatch basic | Low | Medium |

### Output Format per Finding

- **Over-engineering finding** — What is excessive
- **Why it may be excessive** — Workload/team/repo maturity
- **Lower-complexity alternative** — Recommended
- **Risk of simplifying** — Low / Medium / High
- **Cost/ops savings potential** — Low / Medium / High

---

## 4. Cost vs Reliability Tradeoff Model

Tag each recommendation:

| Dimension | Options | Meaning |
|------------|---------|---------|
| **Cost posture** | Cheapest / Balanced / Premium | Cost sensitivity |
| **Reliability posture** | Basic / Production / Mission-critical | HA level |
| **Ops burden** | Low / Medium / High | Operational complexity |

### Tradeoff Examples

| Choice | Cost | Reliability | Security | Ops Burden |
|--------|------|-------------|----------|------------|
| Single-AZ | Lower | Basic | Same | Lower |
| Multi-AZ | Higher | Production | Same | Same |
| Lambda | Lower | Good | Same | Lower |
| EKS | Higher | Flexible | Same | Higher |
| Deeper logging | Higher | Same | Better audit | Higher |
| VPC endpoints | Lower | Same | Better (private) | Same |

---

## 5. Question-Driven Cost Refinement

After baseline, ask the 6 questions (see cost-aware-refinement.md). Refine:

- Compute model
- Network design
- Database choice
- Observability depth
- Backup/DR level
- Monthly cost range

**Delta Summary**: What changed, why, cost impact, reliability impact, ops complexity impact.

---

## 6. Output Format Additions

### Cost Snapshot

- Estimated monthly range by category (Compute, Network, Storage, DB, Observability, CI/CD)
- Top 3 likely cost drivers
- Confidence level: Observed / Inferred / Unknown

### Cheaper Alternatives

- List of lower-cost substitutions
- Projected savings band (Low / Medium / High)

### Overkill / Over-Engineering Check

- What appears too complex
- Simpler option recommended
- Risk of simplifying
- Savings potential

### Cost-Optimized Architecture

- **Cheapest safe baseline** — Minimal cost, acceptable risk
- **Balanced production** — Cost vs reliability balanced
- **Premium / high-resilience** — When mission-critical

---

## 7. Design Rules

- Start with the cheapest safe baseline
- Increase complexity only when justified
- Prefer managed services when they reduce cost and ops
- Avoid fake cost precision
- Clearly distinguish observed vs inferred
- **Do not recommend cost cuts that create security or data-loss risk**
- **Explain when a "cheap" option is a bad choice** — e.g., Single-AZ for prod DB with mission-critical data; removing encryption; skipping backups for important data; Lambda for long-running or stateful workloads
