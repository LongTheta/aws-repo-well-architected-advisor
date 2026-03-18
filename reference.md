# AWS Repo Well-Architected Advisor — Skill Definition & Spec

## Skill Definition

**Name**: aws-repo-well-architected-advisor  
**Purpose**: Review application repos, IaC, CI/CD, K8s manifests, and deployment configs against AWS Well-Architected, CompTIA Cloud+, NIST/CIS, DevOps maturity, and FinOps.  
**Audience**: Solutions Architects, Developer/Platform Engineers, Security Engineers.  
**Output**: Inferred architecture, multi-framework scorecard, role-based findings, prioritized remediation, compliance gaps, cost-effective target architecture.

## Multi-Framework Evaluation

| Framework | Scope |
|-----------|-------|
| AWS Well-Architected | 6 pillars |
| CompTIA Cloud+ | Operational best practices |
| NIST / CIS | Security controls, compliance |
| DevOps Maturity | CI/CD, GitOps, observability |
| FinOps | Cost optimization |

## Module Specifications

### Module 1: Repo Discovery

**Input**: Repository root path  
**Process**:
- Recursively scan for: `*.tf`, `*.tf.json`, `cdk.json`, `*.ts` (CDK), `*.yaml`/`*.yml` (CloudFormation, K8s), `*.json` (CloudFormation)
- Locate CI/CD: `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, `buildspec.yml`, `codepipeline*.json`
- Find Dockerfiles, `.env*`, `docker-compose*.yml`
- Identify deployment scripts, Helm charts, Kustomize overlays

**Output**: Artifact inventory table (path, type, purpose)

### Module 2: Architecture Inference

**Input**: Artifact inventory  
**Process**:
- Parse IaC for: VPC, subnets, EC2, ECS, EKS, Lambda, RDS, S3, SQS, SNS, API Gateway
- Infer account strategy from provider blocks, assume-role, cross-account refs
- Map region(s), AZ usage
- Build dependency graph (compute → storage → networking)

**Output**: Inferred architecture (text + optional Mermaid), assumptions list

### Module 3: Networking Review (Hybrid Networking Lens)

**Input**: IaC, K8s manifests  
**Process**:
- VPC: CIDR, subnet tiers (public/private/data), AZ distribution
- Ingress: ALB/NLB, security groups, NACLs
- Egress: NAT Gateway, IGW, VPC endpoints (interface/gateway)
- Hybrid: Direct Connect, VPN, Transit Gateway, DX LAG
- Segmentation: security groups, NACLs, network firewalls

**Output**: Networking findings with Observed/Inferred/Missing labels

### Module 4: IAM / Security Review

**Input**: IaC, K8s RBAC, CI/CD configs  
**Process**:
- IAM roles, policies, trust boundaries, assume-role
- Secrets: Secrets Manager, Parameter Store, SSM, external vault refs
- Encryption: KMS keys, TLS config, at-rest encryption
- Least privilege, service-linked roles, cross-account

**Output**: Security findings with severity and confidence

### Module 5: Reliability / Resilience Review

**Input**: IaC, K8s, deployment configs  
**Process**:
- Multi-AZ: RDS, EKS node groups, ALB
- Failover: Route 53, cross-region
- Auto-scaling: ASG, ECS/EKS scaling
- Health checks, retries, circuit breakers

**Output**: Reliability findings

### Module 6: Performance / Cost Review

**Input**: IaC, compute/storage configs  
**Process**:
- Compute: instance types, Fargate sizing, Lambda memory/timeout
- Storage: S3 classes, EBS types, RDS instance sizing
- Cost drivers: NAT Gateway, data transfer, idle resources
- Optimization: Reserved/Savings Plans, Spot, Graviton

**Output**: Performance and cost findings

### Module 7: DevOps / Operability Review

**Input**: CI/CD, observability configs  
**Process**:
- Promotion flow: dev → stage → prod, approval gates
- Logging: CloudWatch, Fluent Bit, third-party
- Metrics: CloudWatch, Prometheus, X-Ray
- Tagging: cost allocation, governance

**Output**: Operability findings

### Module 8: CompTIA Cloud+ Operational Review

**Input**: Artifact inventory, IaC, CI/CD, observability configs  
**Process**:
- Run 7 CompTIA validation checks (IaC, CI/CD, backups, monitoring, RTO/RPO, reproducibility, observability)
- Tag each check as Observed / Inferred / Missing Evidence
- Compute CompTIA operational score (0–10)

**Output**: CompTIA validation checklist, operational score

### Module 9: Multi-Framework Scoring and Reporting

**Input**: All module outputs  
**Process**:
- Map findings to AWS 6 pillars, CompTIA, NIST/CIS, DevOps, FinOps
- Compute all five framework scores (see scoring-rubric.md)
- Identify NIST/CIS compliance gaps
- Generate remediation backlog with owner, effort, impact

**Output**: Full report per SKILL.md output format

## Evaluation Areas (Detailed)

| Area | Sub-dimensions | Evidence Sources |
|------|----------------|------------------|
| IaC usage | Terraform, CDK, CloudFormation, modularity | *.tf, cdk.json, *.yaml, *.json |
| Networking | VPC, subnets, routing, ingress/egress | aws_vpc, aws_subnet, aws_nat_gateway, aws_vpc_endpoint |
| IAM and identity | Roles, policies, trust boundaries | aws_iam_role, aws_iam_role_policy |
| Secrets and encryption | Vault, rotation, KMS, TLS | aws_secretsmanager, aws_kms_key |
| Compute | EC2, ECS, EKS, Lambda, Fargate | aws_instance, aws_ecs_service, aws_lambda_function |
| Storage and database | S3, RDS, DynamoDB, backup | aws_s3_bucket, aws_db_instance |
| CI/CD and deployment | Pipelines, GitOps, gates | workflow files, Argo CD, pipeline configs |
| Monitoring, logging, tracing | Observability, alerting | CloudWatch, X-Ray, Prometheus configs |
| Backup and DR | RTO/RPO, restore testing | backup configs, multi-region |
| Cost efficiency | Tagging, Reserved, utilization | tags in IaC, instance types |
| Security compliance | NIST, CIS, OWASP | IAM, encryption, audit configs |

## CompTIA Cloud+ CV0-004 Domains

| Domain | What to Assess |
|--------|----------------|
| Cloud Architecture | VPCs, subnets, routing, load balancing, segmentation |
| Security | IAM/RBAC, encryption, vulnerability scanning, compliance |
| Deployment | IaC, CI/CD, automated deployments, GitOps |
| Operations | Monitoring, backups, scaling, runbooks |
| Troubleshooting | Logging, traceability, failure visibility, reproducibility |
| DevOps Fundamentals | Automation, pipelines, observability |

## CompTIA 8 Best Practices

| # | Practice | Check |
|---|----------|-------|
| 1 | IaC Everything | Terraform/CDK/CloudFormation; no manual config; repeatable envs |
| 2 | Automate Operations | CI/CD, automated deployments, backups, scaling |
| 3 | Backup + DR Design | RTO/RPO defined; replication; geo redundancy; **restore testing** |
| 4 | Networking Fundamentals | VPCs, subnets, routing, LB, firewall rules, segmentation |
| 5 | Security = Identity + Encryption | IAM/RBAC, encryption, vuln scanning, compliance |
| 6 | Monitoring + Observability | Metrics, logs, alerts; proactive detection |
| 7 | Cost Optimization | Right-size; eliminate unused; auto-scaling; Reserved vs on-demand |
| 8 | Troubleshooting Built-In | Logging, traceability, failure visibility, reproducibility |

## CompTIA Validation Checks

| Check | Question | Flag Hard If Missing |
|-------|----------|----------------------|
| IaC automation | Is infrastructure automated via IaC? | — |
| CI/CD presence | Are CI/CD pipelines present and functional? | — |
| Backup automation | Are backups automated? | — |
| Restore testing | Is backup restore tested and documented? | **Yes** |
| RTO/RPO defined | Are RTO and RPO defined and documented? | **Yes** |
| Monitoring and alerts | Is monitoring implemented with actionable alerts? | — |
| Environment reproducibility | Are environments reproducible from IaC? | — |
| Troubleshooting observability | Is troubleshooting observable via logs/metrics/traces? | **Yes** |

## Additional Frameworks

| Framework | Scope | What to Check |
|-----------|-------|---------------|
| **OWASP Top 10** | App security | Insecure APIs, auth gaps, input validation |
| **OWASP API Security Top 10** | API layer | Broken auth, excessive data exposure |
| **CIS Benchmarks** | AWS, Linux, K8s | S3 public access, IAM misconfig, SG exposure |
| **Kubernetes Best Practices** | EKS | Pod security, RBAC, network policies, secrets |
| **DORA Metrics** | DevOps performance | Deployment frequency, lead time, change failure rate, MTTR |
| **FinOps Foundation** | Cost | Cost allocation tagging, unit economics, visibility |

## AWS Well-Architected Pillars

1. **Operational Excellence** — Run and monitor systems, evolve and improve
2. **Security** — Protect information, systems, and assets
3. **Reliability** — Recover from disruption, meet demand
4. **Performance Efficiency** — Use IT and computing resources efficiently
5. **Cost Optimization** — Run systems at the lowest price point
6. **Sustainability** — Minimize environmental impacts

## Confidence Levels

| Level | Definition |
|-------|------------|
| Confirmed | Direct evidence in repo; no inference |
| Strongly Inferred | Clear pattern from multiple artifacts |
| Assumed | Single or weak signal; recommend validation |
