# Sample Questionnaire Answers → Architecture

Example input for Spec-Driven mode. These answers feed into `aws-architecture-decision-engine.md`.

---

## Scenario: Small SaaS Web App (Cost-Sensitive)

| Field | Answer | Drives |
|-------|--------|--------|
| app_type | web_app | Compute: API + frontend; consider Lambda or ECS |
| user_access | authenticated_customers | Cognito; no public anonymous |
| traffic_level | low | Lambda viable; serverless first |
| availability_requirement | standard_99_9 | Multi-AZ for prod; single-AZ for dev |
| data_importance | important | RDS with backups; not mission-critical |
| data_type | relational | RDS Postgres |
| background_processing | light | SQS + Lambda for emails |
| auth_type | simple_login | Cognito user pools |
| team_size | small_team | No EKS; prefer managed |
| cost_priority | aggressive | Serverless; minimize NAT; no over-provisioning |
| compliance_level | basic | Standard IAM; no FedRAMP stack |
| growth_expectation | moderate_growth | Growth path with triggers |

**Expected decision engine output:**
- Compute: Lambda + API Gateway (or ECS Fargate if containerized)
- Database: RDS Postgres (single-AZ dev; Multi-AZ prod)
- Auth: Cognito
- Async: SQS + Lambda
- Networking: Single VPC; avoid NAT where possible; VPC endpoints for S3/ECR
- Cost band: Low ($50–$250/mo)

---

## Scenario: Internal Data Pipeline (Moderate Scale)

| Field | Answer | Drives |
|-------|--------|--------|
| app_type | data_pipeline | Batch/streaming; Step Functions or ECS |
| user_access | internal_only | IAM/SSO; no Cognito |
| traffic_level | moderate | Steady; ECS workers viable |
| availability_requirement | best_effort | Single-AZ acceptable |
| data_importance | important | S3 + RDS; backups |
| data_type | mixed | S3 for raw; RDS for processed |
| background_processing | heavy | Step Functions or SQS + ECS |
| auth_type | none | IAM roles only |
| team_size | platform_team | Can support containers |
| cost_priority | balanced | Mix serverless + containers |
| compliance_level | moderate | Audit logging; stricter IAM |
| growth_expectation | moderate_growth | Add autoscaling later |

**Expected decision engine output:**
- Compute: ECS Fargate workers
- Database: RDS + S3
- Auth: IAM roles
- Async: SQS + ECS or Step Functions
- Cost band: Moderate ($250–$1k/mo)

---

## Scenario: High-Compliance Public API

| Field | Answer | Drives |
|-------|--------|--------|
| app_type | api_service | API Gateway + Lambda or ECS |
| user_access | public | ALB; CloudFront if global |
| traffic_level | high | Autoscaling; consider ECS |
| availability_requirement | high_99_99 | Multi-AZ; read replicas |
| data_importance | mission_critical | RDS Multi-AZ; backups |
| data_type | relational | RDS Postgres |
| background_processing | none | N/A |
| auth_type | oauth_sso | Cognito + IdP |
| team_size | platform_team | Can support complexity |
| cost_priority | performance_first | Allow higher spend for reliability |
| compliance_level | regulated | NIST; audit; VPC isolation |
| growth_expectation | rapid_growth | Design for scale from start |

**Expected decision engine output:**
- Compute: ECS Fargate or Lambda (traffic-dependent)
- Database: RDS Multi-AZ; read replica for scale
- Auth: Cognito + external IdP
- Networking: Private subnets; VPC endpoints; ALB
- Security: Audit logging; stricter IAM; encryption
- Cost band: High ($1k–$5k/mo)
