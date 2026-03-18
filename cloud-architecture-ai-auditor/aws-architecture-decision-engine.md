# AWS Architecture Decision Engine

Convert application questionnaire answers into concrete AWS architecture decisions using rule-based logic. Prioritize cost-effective, secure, and scalable solutions.

**Mindset:** Think constraints, risks, and tradeoffs first — not services. See `architect-mindset.md` for the 5 core areas and the 4 tradeoffs. Every service choice must be traceable to input answers.

---

## Flow (In Order)

1. **Interpret** — Translate answers into constraints (business, users, data, workload, security)
2. **Resolve tradeoffs** — Cost vs reliability; simplicity vs flexibility; speed vs security; managed vs custom
3. **Map to services** — Apply rule-based logic below
4. **Explain** — Tie every major decision back to input answers

---

## Input

Accept structured answers from the questionnaire:

| Field | Values / Notes |
|-------|----------------|
| `app_type` | web_app, api_service, internal_tool, data_pipeline, background_jobs, mixed |
| `user_access` | public, internal_only, authenticated_customers, mixed |
| `traffic_level` | very_low, low, moderate, high, spiky_unpredictable |
| `availability_requirement` | best_effort, standard_99_9, high_99_99 |
| `data_importance` | non_critical, important, mission_critical |
| `data_type` | relational, document_json, file_storage, mixed |
| `background_processing` | none, light, moderate, heavy |
| `auth_type` | none, simple_login, oauth_sso, multi_tenant |
| `team_size` | solo, small_team, platform_team |
| `cost_priority` | aggressive, balanced, performance_first |
| `compliance_level` | basic, moderate, high, regulated |
| `growth_expectation` | small_stable, moderate_growth, rapid_growth, unknown |

---

## Step 1: Interpret Constraints (Before Any Service Choice)

| Core Area | Derive From | Constraint Examples |
|-----------|-------------|---------------------|
| **Business** | app_type, cost_priority, growth_expectation | "Cost-sensitive; avoid overbuild" / "Reliability first; allow higher spend" |
| **Users** | user_access, traffic_level | "Public; spiky traffic → serverless" / "Internal only → simpler networking" |
| **Data** | data_type, data_importance, compliance_level | "Mission-critical relational → RDS Multi-AZ" / "Sensitive → encryption, audit" |
| **Workload** | app_type, background_processing | "Event-driven + light async → Lambda + SQS" / "Heavy batch → Step Functions" |
| **Security** | auth_type, compliance_level | "Simple login → Cognito" / "Regulated → stricter IAM, VPC isolation" |
| **Team** | team_size | "Solo → no EKS" / "Platform team → can support containers" |

---

## Step 2: Resolve Tradeoffs (Explicit)

| Tradeoff | Question | How Input Drives It |
|----------|----------|---------------------|
| **Cost vs Reliability** | Can we afford downtime? | availability_requirement + cost_priority |
| **Simplicity vs Flexibility** | Will this evolve? | growth_expectation |
| **Speed vs Security** | What's acceptable risk? | compliance_level |
| **Managed vs Custom** | Do we want to own this? | team_size + cost_priority |

Surface which tradeoff drove each major decision in the output.

---

## Step 3: Decision Logic (Map Constraints → Services)

### 1. Compute Selection

| Condition | Recommendation | Reasoning |
|-----------|----------------|-----------|
| Low traffic **AND** (spiky OR unpredictable) **AND** small team | **Lambda + API Gateway** | No infra; pay per request; auto-scale; minimal ops |
| Steady moderate traffic **AND** containerized app **AND** some control needed | **ECS Fargate** | Managed containers; no node management; scale tasks |
| High scale **OR** complex orchestration **AND** large team with K8s experience | **EKS** | Only if justified — K8s ecosystem, multi-cluster, or workload demands |
| Legacy **OR** long-running workloads | **EC2** | Full control; Reserved/Spot; self-managed |

**Rule:** Do NOT recommend EKS unless clearly justified. Prefer Lambda or ECS for most workloads.

---

### 2. Database Selection

| Condition | Recommendation | Reasoning |
|-----------|----------------|-----------|
| Relational + transactions required | **Amazon RDS (Postgres preferred)** | ACID; managed; familiar |
| Flexible schema / JSON / high scale | **DynamoDB** | Serverless; single-digit ms; on-demand |
| File / media storage | **S3** | Durable; lifecycle; cheap |
| Caching needed | **ElastiCache (Redis)** | Sub-ms latency; session, cache |
| Mixed (relational + files) | **RDS + S3** | Right tool per data type |

---

### 3. Networking

| Condition | Recommendation | Reasoning |
|-----------|----------------|-----------|
| **Default** | Single VPC; Public + Private subnets | Standard pattern; ALB public, compute private |
| Low traffic + cost sensitive | Avoid NAT Gateway; use public Lambda/ECS if acceptable | NAT is ~$32/AZ/month; minimize when possible |
| Higher security | Private subnets + VPC endpoints | S3, ECR, SSM, etc. via endpoints; no NAT for AWS APIs |
| Public app | ALB + Route 53 + (CloudFront if needed) | L7 routing; health checks; CDN for static/global |

---

### 4. Authentication

| Condition | Recommendation | Reasoning |
|-----------|----------------|-----------|
| Simple login | **Cognito** | Managed; user pools; MFA |
| Enterprise / SSO | **Cognito + external IdP** | SAML/OIDC; federate to Okta, Azure AD, etc. |
| Internal only | **IAM / SSO** | No Cognito; IAM roles; AWS SSO for humans |

---

### 5. Background Processing / Async / Event Patterns

| Condition | Recommendation | Reasoning |
|-----------|----------------|-----------|
| Light async | **SQS + Lambda** | Event-driven; scale to zero |
| Event routing / fan-out | **EventBridge** | Schema registry; event bus; decoupling |
| Moderate | **SQS + ECS workers** | Longer jobs; more control |
| Heavy pipelines | **Step Functions / Batch** | Orchestration; batch jobs; fault-tolerant |

---

### 6. Observability

| Always Include | Add When Higher Maturity |
|----------------|---------------------------|
| CloudWatch Logs | X-Ray / OpenTelemetry tracing |
| CloudWatch Metrics + Alarms | Custom dashboards; SLOs |
| Basic dashboards | Centralized logging (if multi-service) |

---

### 7. Security Baseline

**Always:**

- IAM roles (no hardcoded creds)
- Least privilege
- Secrets Manager or Parameter Store
- Encryption at rest (KMS)
- HTTPS everywhere

**If high compliance:**

- Audit logging (CloudTrail; Config)
- Stricter IAM boundaries
- VPC isolation

---

### 8. Tagging Strategy (Mandatory)

All resources must include:

| Tag | Purpose |
|-----|---------|
| Project | Cost allocation; project grouping |
| Environment | dev, staging, prod |
| Owner | Team or person |
| CostCenter | Finance / chargeback |
| ManagedBy | IaC tool (e.g., Terraform) |
| Purpose | What the resource does |
| DataClassification | public, internal, confidential, restricted |
| Lifecycle | active, deprecated, experimental |

**Missing tags = HIGH severity issue**

---

### 9. Cost Optimization

| Cost Priority | Approach |
|---------------|----------|
| **Aggressive** | Serverless first; minimize NAT; avoid over-provisioning; on-demand + scale-to-zero |
| **Balanced** | Mix of serverless + containers; right-size; Reserved where predictable |
| **Performance first** | Allow higher baseline cost for stability; Multi-AZ; read replicas |

---

### 10. Growth Path

Always output 3 stages:

| Stage | Description | Triggers |
|-------|-------------|----------|
| **1. Initial (cheap baseline)** | Minimal viable platform | Day one |
| **2. Moderate scale** | Add autoscaling, caching, Multi-AZ | Traffic growth; team growth |
| **3. High scale** | Read replicas; multi-region; sharding | High traffic; compliance; DR |

Explain what changes at each stage and what triggers the change.

---

## Output Format

Produce the following sections in order:

1. **Interpreted Requirements** — Translate input answers into architecture constraints (by core area: business, users, data, workload, security)
2. **Architecture Decisions (with reasoning)** — Each major decision + why (tied to input)
3. **Recommended AWS Services** — Table: Category | Service | Justification
4. **Architecture Flow (text-based)** — Request flow; data flow; component interactions
5. **Cost Estimate Range** — Band (e.g., $50–$250/mo); top drivers; confidence
6. **Security Baseline** — IAM, secrets, encryption, audit
7. **Observability Plan** — Logs, metrics, alarms, dashboards
8. **Tagging Plan** — Required tags; examples
9. **Risks & Tradeoffs** — Cost vs reliability; simplicity vs flexibility; speed vs security; managed vs custom (tie to input)
10. **Growth Path** — 3 stages with triggers and changes

---

## Rules

- **Constraints first** — Interpret answers into constraints before choosing services
- **Start simple** — Minimal viable architecture first
- **Avoid over-engineering** — No EKS for single app; no Multi-AZ in dev unless required
- **Prefer managed services** — RDS over self-managed DB; SQS over self-hosted queue
- **Do NOT recommend EKS** unless clearly justified
- **Always explain decisions** — Tie every major decision back to input answers
- **Feel like a senior solutions architect** — Not a generic template; tailored to the app

---

## Invocation

```
Convert these questionnaire answers into AWS architecture decisions:

app_type: [value]
user_access: [value]
traffic_level: [value]
availability_requirement: [value]
data_importance: [value]
data_type: [value]
background_processing: [value]
auth_type: [value]
team_size: [value]
cost_priority: [value]
compliance_level: [value]
growth_expectation: [value]

Use aws-architecture-decision-engine: apply rule-based logic; produce Interpreted Requirements, Architecture Decisions, Recommended Services, Architecture Flow, Cost Estimate, Security Baseline, Observability Plan, Tagging Plan, Risks & Tradeoffs, Growth Path. Tie every decision to input.
```

---

## Integration

- **Mindset:** `architect-mindset.md` — 5 core areas, 4 tradeoffs, 10 key questions
- **Input source:** `aws-app-platform-questionnaire.md` (answers)
- **Design context:** `aws-platform-blueprint-for-app.md` (full platform scope)
- **Spec-Driven mode:** Invoked after questionnaire; feeds into platform blueprint

---

## End Goal

Produce an AWS architecture that feels like it was designed by a senior solutions architect — not a generic template. Every service choice, every tradeoff, and every growth stage should be traceable to the questionnaire answers.
