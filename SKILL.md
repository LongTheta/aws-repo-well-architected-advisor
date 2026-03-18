---
name: aws-repo-well-architected-advisor
description: Reviews application repos, IaC, CI/CD pipelines, Kubernetes manifests, and deployment configs against the AWS Well-Architected Framework, CompTIA Cloud+ operational best practices, NIST/CIS security controls, DevOps maturity, and FinOps principles. Multi-framework evaluation with role-based findings. Use when reviewing AWS workloads, Terraform/CDK/CloudFormation, EKS/ECS/Lambda configs, VPC design, IAM, cost optimization, Well-Architected compliance, CompTIA Cloud+, NIST, CIS, or FinOps.
risk_tier: 1
---

# AWS Repo Well-Architected Advisor

Reviews repositories using a **multi-framework evaluation layer** combining AWS Well-Architected, CompTIA Cloud+, NIST/CIS security controls, DevOps maturity, and FinOps cost optimization. Uses a modular specialist-agent pattern: each domain is evaluated separately with evidence-based findings, explicit confidence levels, and actionable remediation backlogs.

## When to Use

- User asks to review an AWS workload, repo, or architecture
- User mentions Well-Architected, Terraform, CDK, CloudFormation, EKS, ECS, Lambda, VPC, IAM
- User wants cost optimization, security posture, reliability assessment, or compliance review
- User needs role-based findings for architect, developer, or security engineer
- User references CompTIA Cloud+, NIST, CIS, FinOps, or DevOps maturity

## Multi-Framework Evaluation Layer

The system evaluates repos across five layers. Together they form an **automated cloud architecture review engine with enterprise + federal alignment**:

| Layer | Framework | What It Covers | Score Range |
|-------|-----------|----------------|-------------|
| **1** | AWS Well-Architected | Cloud design best practices (6 pillars) | 0–10 per pillar |
| **2** | CompTIA Cloud+ | Operational best practices — can this actually run in production? Is it maintainable? | 0–10 |
| **3** | Security / Compliance | NIST, CIS, OWASP alignment; hardening; audit | 0–10 |
| **4** | DevOps Maturity | CI/CD, GitOps, observability, deployment safety | 0–10 |
| **5** | Cost Efficiency | FinOps signals; right-sizing; cost visibility | 0–10 |

## Orchestrator & Specialist Skills

This skill orchestrates a full review. For focused assessments, invoke specialist skills directly:

| Specialist | Use When |
|------------|----------|
| **aws-architecture-pattern-advisor** | Service selection, anti-patterns, right-sizing |
| **security-review** | IAM, secrets, encryption focus |
| **networking-review** | VPC, subnets, NAT, security groups focus |
| **devops-review** | CI/CD, GitOps, observability focus |
| **nist-compliance-evaluator** | NIST, Zero Trust, FedRAMP focus |
| **observability-grafana-advisor** | Grafana dashboards, DORA metrics focus |
| **finops-cost-optimizer** | Cost optimization, savings focus |

## Design Foundations

1. **Modular specialist-agent pattern** — Evaluate each domain independently; aggregate into unified report
2. **Evidence-based findings** — Tag all findings as **Observed** / **Inferred** / **Missing Evidence**
3. **AWS Well-Architected Framework** — Primary review spine (6 pillars)
4. **CompTIA Cloud+** — Operational validation checks (IaC automation, CI/CD, backups, monitoring, RTO/RPO, reproducibility, troubleshooting)
5. **NIST/CIS** — Security compliance and hardening alignment
6. **Actionable remediation backlog** — Owner, effort, impact for each item
7. **Cost-effective target-state** — Recommendations that reduce cost, not just risks

## Review Modules (Run in Order)

### 1. Repo Discovery

- Scan repo structure for IaC (Terraform, CDK, CloudFormation, Pulumi)
- Identify CI/CD configs (GitHub Actions, GitLab CI, Jenkins, CodePipeline)
- Locate Kubernetes manifests (EKS, Helm, raw YAML)
- Find deployment configs, Dockerfiles, environment files
- Output: inventory of artifacts and paths

### 2. Architecture Inference

- Infer current-state AWS architecture from discovered artifacts
- Map: compute (EC2/ECS/EKS/Lambda/Fargate), storage, databases, eventing
- Identify account strategy, region usage, multi-account patterns
- Output: inferred architecture diagram (text/mermaid) and assumptions

### 3. Networking Review

- VPC/subnet topology, CIDR design, AZ distribution
- Ingress/egress design, NAT, internet gateways, VPC endpoints
- Hybrid networking (Direct Connect, VPN, Transit Gateway) per AWS Hybrid Networking Lens
- Security groups, NACLs, network segmentation
- Output: networking findings with Observed/Inferred/Missing labels

### 4. IAM / Security Review

- IAM roles, policies, trust boundaries
- Secrets management (Secrets Manager, Parameter Store, external vaults)
- Encryption (KMS, TLS, at-rest)
- Least privilege, service-linked roles, cross-account access
- Output: security findings with severity and confidence

### 5. Reliability / Resilience Review

- Multi-AZ, failover, auto-scaling
- DR/backup/failover patterns
- Health checks, circuit breakers, retries
- Output: reliability findings

### 6. Performance / Cost Review

- Compute choices and right-sizing
- Storage and database choices
- Cost drivers, idle resources, optimization opportunities
- Output: performance and cost findings

### 7. DevOps / Operability Review

- CI/CD and promotion flow (dev → stage → prod)
- Logging, metrics, tracing (CloudWatch, X-Ray, third-party)
- Tagging, governance, cost allocation
- Output: operability findings

### 8. CompTIA Cloud+ Operational Review

- Map findings to CV0-004 domains (Architecture, Security, Deployment, Operations, Troubleshooting, DevOps)
- Run 8 CompTIA best-practice checks (IaC, CI/CD, Backup/DR with RTO/RPO + restore testing, Networking, Security, Monitoring, Cost, Troubleshooting)
- Run validation checks; **flag RTO/RPO, restore testing, and troubleshooting gaps hard**
- Tag each check as Observed / Inferred / Missing Evidence
- Output: CompTIA operational score (0–10) and validation checklist

### 9. Multi-Framework Scoring and Reporting

- Aggregate findings into all five score dimensions
- Compute AWS pillar scores, CompTIA operational, Security/Compliance, DevOps maturity, Cost optimization
- Map compliance gaps to NIST/CIS controls
- Produce final report per output format below

## Evaluation Areas (Cross-Framework)

Evaluate repos across these dimensions:

| Area | What to Assess |
|------|----------------|
| **Infrastructure as Code** | Terraform, CDK, CloudFormation usage; modularity; state management |
| **Networking** | VPC, subnets, routing, ingress/egress, NACLs, security groups; CompTIA networking fundamentals |
| **IAM and identity** | Roles, policies, trust boundaries, least privilege |
| **Secrets and encryption** | Secrets Manager, Parameter Store, KMS, TLS, at-rest encryption |
| **Compute selection** | EC2, ECS, EKS, Lambda, Fargate; right-sizing |
| **Storage and database** | S3, RDS, DynamoDB, EBS; backup, retention |
| **CI/CD and deployment** | Pipelines, GitOps, promotion gates, deployment safety |
| **Monitoring, logging, tracing** | CloudWatch, X-Ray, Prometheus; alerting; observability |
| **Backup and DR** | Automated backups, **RTO/RPO definition**, **restore testing** — flag hard if missing |
| **Cost efficiency** | Tagging, Reserved/Spot, idle resources, FinOps practices |
| **Security compliance** | NIST, CIS, OWASP (Top 10, API Security Top 10); hardening; audit logging |
| **Kubernetes (EKS)** | Pod security, RBAC, network policies, secrets handling per K8s best practices |
| **DORA signals** | Deployment frequency, lead time, change failure rate, MTTR (if inferrable from CI/CD) |

## CompTIA Cloud+ (CV0-004) Evaluation

CompTIA Cloud+ is operational best practices — not just theory. Map findings to these domains:

| Domain | What to Assess |
|--------|----------------|
| **Cloud Architecture** | VPCs, subnets, routing, load balancing, segmentation |
| **Security** | IAM/RBAC, encryption at rest/transit, vulnerability scanning, compliance |
| **Deployment** | IaC, CI/CD, automated deployments, GitOps |
| **Operations** | Monitoring, backups, scaling, runbooks |
| **Troubleshooting** | Logging, traceability, failure visibility, reproducibility — **flag hard if missing** |
| **DevOps Fundamentals** | Automation, pipelines, observability |

### CompTIA 8 Best Practices (Flag Gaps Hard)

| Practice | Check | Why It Matters |
|----------|-------|----------------|
| **1. IaC Everything** | Terraform/CDK/CloudFormation; no manual config; repeatable envs | Consistency and automation |
| **2. Automate Operations** | CI/CD, automated deployments, backups, scaling | Aligns with GitOps + Argo vision |
| **3. Backup + DR Design** | **RTO/RPO defined**; replication; geo redundancy; **restore testing** | **BIG gap in most repos — flag hard** |
| **4. Networking Fundamentals** | VPCs, subnets, routing, load balancing, firewall rules, segmentation | Backbone of cloud systems |
| **5. Security = Identity + Encryption** | IAM/RBAC, encryption at rest/transit, vulnerability scanning, compliance |
| **6. Monitoring + Observability** | Metrics, logs, alerts; proactive detection; performance tracking |
| **7. Cost Optimization** | Right-size; eliminate unused; auto-scaling; Reserved vs on-demand |
| **8. Troubleshooting Built-In** | Logging, traceability, failure visibility, reproducibility — **most architectures fail here** |

### CompTIA Validation Checks

Apply these checks and tag evidence. **Prioritize RTO/RPO, restore testing, and troubleshooting** — they are often missing:

| Check | Question | Evidence Tag |
|-------|----------|--------------|
| **IaC automation** | Is infrastructure automated via IaC (Terraform, CDK, CloudFormation)? | Observed / Inferred / Missing |
| **CI/CD presence** | Are CI/CD pipelines present and functional? | Observed / Inferred / Missing |
| **Backup automation** | Are backups automated? | Observed / Inferred / Missing |
| **Restore testing** | Is backup restore tested and documented? **Flag hard if missing** | Observed / Inferred / Missing |
| **RTO/RPO defined** | Are RTO and RPO defined and documented? **Flag hard if missing** | Observed / Inferred / Missing |
| **Monitoring and alerts** | Is monitoring implemented with actionable alerts? | Observed / Inferred / Missing |
| **Environment reproducibility** | Are environments reproducible from IaC? | Observed / Inferred / Missing |
| **Troubleshooting observability** | Is troubleshooting observable via logs/metrics/traces? **Flag hard if missing** | Observed / Inferred / Missing |

## Scoring Model

- **AWS pillar score**: 0–10 per pillar (6 pillars)
- **CompTIA operational score**: 0–10
- **Security/compliance score**: 0–10 (NIST/CIS alignment)
- **DevOps maturity score**: 0–10
- **Cost optimization score**: 0–10 (FinOps)
- **Severity**: Critical / High / Medium / Low
- **Confidence**: Confirmed / Strongly Inferred / Assumed

## Output Format

Produce the report in this order. See [sample-output-report.md](sample-output-report.md) for a full example.

```markdown
# AWS Well-Architected Review — [Repo Name]

## 1. Executive Summary
[2–4 paragraphs: overall posture, top risks, key recommendations, bottom-line scores]

## 2. Inferred Architecture
[Diagram or structured description; call out assumptions and missing evidence]

## 3. Multi-Framework Scorecard
| Framework | Score (0–10) | Key Gaps |
|-----------|--------------|----------|
| AWS Well-Architected (avg) | | |
| CompTIA Operational | | |
| Security/Compliance (NIST/CIS) | | |
| DevOps Maturity | | |
| Cost Optimization (FinOps) | | |

### AWS Pillar Breakdown
| Pillar | Score (0–10) | Key Gaps |
|--------|--------------|----------|
| Operational Excellence | | |
| Security | | |
| Reliability | | |
| Performance Efficiency | | |
| Cost Optimization | | |
| Sustainability | | |

## 4. Top 10 Risks
[Ranked by severity × impact; each with ID, description, pillar, confidence, evidence tag]

## 5. Role-Based Findings
### Architect
[Architecture-level findings; tag each as Observed/Inferred/Missing Evidence]

### Developer
[Implementation findings, IaC quality, CI/CD, operational tasks; tag each]

### Security
[Security findings, IAM, secrets, encryption, compliance gaps; tag each]

## 6. Prioritized Remediation Backlog
| ID | Finding | Owner | Effort | Impact | Priority |
|----|---------|-------|--------|--------|----------|
| ... | ... | ... | ... | ... | ... |

## 7. Cost-Effective Target Architecture
[Concrete target architecture; quick wins vs medium-term vs strategic redesign]

## 8. Compliance Gaps (NIST/CIS)
| Control / Category | Status | Evidence | Remediation |
|--------------------|--------|----------|-------------|
| ... | ... | ... | ... |

## 9. Suggested Next Implementation Steps by Repo
[Actionable steps grouped by repo/artifact; ordered by priority]
```

## Evidence Labels (Apply to All Findings)

| Label | Meaning |
|-------|---------|
| **Observed** | Direct evidence in repo (config, code, manifest) |
| **Inferred** | Derived from patterns, naming, or partial evidence |
| **Missing Evidence** | Assumption; recommend validation |

**Rule**: Tag every finding with one of these labels. Use in Top 10 Risks, Role-Based Findings, Compliance Gaps, and CompTIA validation checks.

## Mandatory Rules

- **Never fabricate** — If evidence is missing, label it and recommend validation
- **Tag all findings** — Every finding must have an evidence label (Observed / Inferred / Missing Evidence)
- **Be cost-aware** — Target-state recommendations must consider cost, not only correctness
- **Role-specific** — Findings must be actionable for architect, developer, and security engineer
- **Prioritize** — Remediation backlog ordered by impact and effort

## Additional Resources

- [prompt-template.md](prompt-template.md) — Invocation prompt template
- [reference.md](reference.md) — Skill definition, module specs, dimension details
- [scoring-rubric.md](scoring-rubric.md) — Per-pillar scoring criteria
- [sample-input-repo-structure.md](sample-input-repo-structure.md) — Expected repo layout
- [sample-output-report.md](sample-output-report.md) — Full report example
- [production-readiness-checklist.md](production-readiness-checklist.md) — Pre-production checklist
