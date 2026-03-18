# AWS App Platform Questionnaire

Collect the minimum high-impact information needed to design a cost-effective, secure, and scalable AWS platform for a real application.

**Mindset:** The questionnaire does **not** just collect answers — it translates answers into decisions. See `architect-mindset.md` for the 5 core areas (Business, Users, Data, Workload, Security) and how answers drive architecture choices.

---

## Intro Text

> I'm going to design your AWS platform. Answer these quick questions so I can right-size it for cost, security, and scalability. I'll translate your answers into concrete architecture decisions — not a generic template.

---

## Core Questions (Organized by Core Area)

### Area 1: Business & Product Context

#### 1. Application Type

Choose one:

- Web app (frontend + backend)
- API service
- Internal tool
- Data pipeline / analytics
- Background jobs / workers
- Mixed

*Drives: compute choice, workload pattern, background processing*

---

#### 2. User Access

- Public internet users
- Internal users only
- Authenticated customers
- Mixed

---

### 3. Traffic Level

- Very low (testing / early stage)
- Low (small user base)
- Moderate
- High
- Spiky / unpredictable

*Drives: Lambda vs ECS, serverless vs containers, autoscaling*

---

#### 4. Availability Requirement

- Best effort (downtime acceptable)
- Standard production (~99.9%)
- High availability (~99.99%+)

*Drives: Multi-AZ, cost vs reliability tradeoff*

---

### Area 3: Data & State

#### 5. Data Importance

- Non-critical
- Important
- Mission-critical

*Drives: backup strategy, RTO/RPO, Multi-AZ*

---

#### 6. Data Type

- Relational (structured, transactions)
- Document / JSON
- File storage (uploads, media)
- Mixed

*Drives: RDS vs DynamoDB vs S3, encryption, compliance*

---

### Area 4: Workload & Compute Behavior

#### 7. Background Processing

- None
- Light (emails, small jobs)
- Moderate (queues, async tasks)
- Heavy (pipelines, batch processing)

*Drives: SQS, Lambda, ECS workers, Step Functions*

---

### Area 5: Security, Compliance & Risk

#### 8. Authentication / Identity

- None
- Simple login
- OAuth / SSO
- Multi-tenant / complex auth

*Drives: Cognito vs IAM, IdP integration*

---

### Cost & Team Reality

#### 9. Team Size / Expertise

- Solo developer
- Small team
- Dedicated platform/DevOps team

*Drives: EKS vs ECS, complexity, maintenance*

---

#### 10. Cost Priority

- Aggressive cost savings
- Balanced
- Performance / reliability first

*Drives: serverless vs NAT, over-provisioning, cost tier*

---

#### 11. Compliance / Security Needs

- Basic
- Moderate
- High
- Regulated (federal, healthcare, etc.)

*Drives: IAM boundaries, audit logging, VPC isolation*

---

#### 12. Growth Expectation (12–24 months)

- Small / stable
- Moderate growth
- Rapid growth
- Unknown

*Drives: growth path, upgrade triggers, initial vs future architecture*

---

## The 10 Most Important (If Simplifying)

1. What are you building? *(app_type)*  
2. Who uses it? *(user_access)*  
3. How many users now vs later? *(traffic_level, growth_expectation)*  
4. How critical is uptime? *(availability_requirement)*  
5. What kind of data? *(data_type)*  
6. How sensitive is the data? *(data_importance, compliance_level)*  
7. Do you need background processing? *(background_processing)*  
8. What's your budget priority? *(cost_priority)*  
9. What's your team size? *(team_size)*  
10. How fast will this grow? *(growth_expectation)*  

---

## Output Requirements

After collecting answers, generate:

### 1. Interpreted Requirements Summary

Translate answers into architecture constraints:

- Compute requirements
- Data requirements
- Security requirements
- Cost constraints
- Team constraints

### 2. Cost-Optimized Baseline Architecture

- Simplest safe design
- AWS services selected
- Diagram (ASCII or Mermaid)

### 3. Key Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Compute | Lambda / ECS / EKS / EC2 | [justification] |
| Database | RDS / DynamoDB / S3 / etc. | [justification] |
| Networking | VPC model, subnets, endpoints | [justification] |
| IAM | Role model, boundaries | [justification] |

### 4. Cost Snapshot

- Rough monthly estimate range (band)
- Top cost drivers
- Confidence level

### 5. Security Baseline

- IAM approach
- Secrets management
- Logging/audit

### 6. Observability Plan

- Logs
- Metrics
- Alerts

### 7. Growth Path

| Stage | Triggers | Changes |
|-------|----------|---------|
| Moderate scale | [traffic, users, etc.] | [changes] |
| High scale | [scale, compliance] | [changes] |

### 8. Tradeoffs

- Cost vs reliability
- Simplicity vs flexibility
- Performance vs cost

---

## Rules

- **Default to the cheapest safe architecture**
- **Avoid over-engineering**
- **Do not recommend EKS unless clearly justified**
- **Prefer managed services when appropriate**
- **Clearly explain why each major service is chosen**
- **Keep recommendations practical for the given team size**

---

## Invocation

```
I'm going to design your AWS platform. Answer these quick questions so I can right-size it for cost, security, and scalability.

1. Application type: Web app / API service / Internal tool / Data pipeline / Background jobs / Mixed
2. User access: Public / Internal only / Authenticated customers / Mixed
3. Traffic level: Very low / Low / Moderate / High / Spiky
4. Availability: Best effort / ~99.9% / ~99.99%+
5. Data importance: Non-critical / Important / Mission-critical
6. Data type: Relational / Document / File storage / Mixed
7. Background processing: None / Light / Moderate / Heavy
8. Authentication: None / Simple login / OAuth/SSO / Multi-tenant
9. Team size: Solo / Small team / Platform team
10. Cost priority: Aggressive savings / Balanced / Performance first
11. Compliance: Basic / Moderate / High / Regulated
12. Growth (12–24 mo): Small / Moderate / Rapid / Unknown

Use aws-app-platform-questionnaire output format after answers.
```

---

## End Goal

Produce a **real AWS platform design tailored to the application**, not a generic architecture.
