# AWS Repo Well-Architected Advisor

**The canonical AWS-specific implementation** of a multi-cloud platform design system for the LongTheta ecosystem. Production-grade platform design and review for AWS workloads.

---

## Purpose

This repository is the **AWS-first** platform design and review system. It supports:

| Capability | Description |
|------------|-------------|
| **Repo-Driven AWS Platform Review** | Analyze existing repos; infer current-state AWS architecture; identify gaps |
| **Spec-Driven AWS Platform Design** | Design the cheapest safe AWS platform from requirements |
| **Cost-Aware Architecture Recommendations** | Default to cost-effective baseline; avoid over-engineering |
| **Governance and Tagging Enforcement** | Mandatory tagging; cost allocation; compliance |
| **Production-Readiness Reporting** | Executive summary, risks, remediation backlog, target-state |

**Scope:** AWS only. AWS Well-Architected is the primary framework. AWS-native services and terminology only. No Azure or GCP logic in this repo.

---

## Operating Modes

### Repo-Driven Mode

**Trigger:** Repos provided; user asks for analysis, review, or improvements.

**Artifacts inspected:** Terraform, CDK, CloudFormation, Docker, CI/CD (GitHub Actions, GitLab CI, CodeBuild), Kubernetes manifests.

**Gaps identified:**
- Networking (VPC, subnets, NAT, endpoints)
- IAM (roles, policies, least privilege)
- Secrets (hardcoded creds, Secrets Manager, Parameter Store)
- Compute/runtime fit (Lambda vs ECS vs EKS vs EC2)
- Observability (logs, metrics, traces, alarms)
- Tagging (required tag set)
- Cost posture (NAT, over-provisioning, cheaper alternatives)

**Output:** Audit-style report, remediation backlog, optimized target-state AWS architecture.

---

### Spec-Driven Mode

**Trigger:** No repo; user asks to design a system or provides requirements.

**Flow:** Application questionnaire → decision engine (rule-based) → platform blueprint.

**Recommendations cover:**
- Compute (Lambda, ECS/Fargate, EKS only when justified, EC2 for legacy)
- Data layer (RDS/Postgres, DynamoDB, S3, ElastiCache)
- Networking (VPC, ALB, Route 53, CloudFront)
- IAM (roles, Cognito, SSO)
- Observability (CloudWatch, X-Ray)
- CI/CD (CodePipeline, GitHub Actions, etc.)
- Growth path (initial → moderate → high scale)

**Output:** Platform blueprint, architecture decisions, cost estimate, implementation plan.

---

## Mandatory Tagging

All AWS resources must include these tags. Missing tags = **HIGH severity**.

| Tag | Purpose |
|-----|---------|
| Project | Cost allocation; project grouping |
| Environment | dev, test, prod |
| Owner | Team or person responsible |
| CostCenter | Finance / chargeback |
| ManagedBy | terraform, cloudformation, manual, other |
| Purpose | What the resource does |
| DataClassification | public, internal, confidential, restricted |
| Lifecycle | active, deprecated, experimental |

See `cloud-architecture-ai-auditor/tagging-compliance.yaml`.

---

## AWS Decision Logic

| Workload | Recommendation | When |
|----------|----------------|------|
| Low-traffic, bursty, stateless | **Lambda** | Event-driven; scale to zero |
| Moderate containerized | **ECS Fargate** | Managed; no node management |
| K8s ecosystem required | **EKS** | Only when clearly justified |
| Legacy, long-running | **EC2** | Reserved/Spot; full control |
| Relational + transactions | **RDS (Postgres)** | ACID; managed |
| Key-value, document, scale | **DynamoDB** | Serverless; on-demand |
| File / object storage | **S3** | Durable; lifecycle |
| Async / event patterns | **SQS, EventBridge, Step Functions** | Right tool per pattern |

**Rule:** Do NOT recommend EKS unless justified. Prefer Lambda or ECS for most workloads.

---

## Output (Both Modes)

Every report includes:

1. Executive summary
2. Current or proposed AWS architecture
3. Cost snapshot
4. Security baseline
5. Observability plan
6. Tagging compliance
7. Top risks
8. Remediation backlog
9. Target-state AWS architecture

---

## Repository Structure

```
aws-repo-well-architected-advisor/
│
├── cloud-architecture-ai-auditor/     # Core orchestration and rules
│   ├── well-architected-scoring-engine # Report synthesis
│   ├── repo-discovery                 # Inventory IaC, CI/CD, K8s
│   ├── architecture-inference         # Infer current-state AWS architecture
│   ├── devops-operability-review      # CI/CD, deployment safety
│   ├── operating-modes.yaml           # Repo-Driven vs Spec-Driven
│   ├── architect-mindset.md           # Constraints first; 5 core areas
│   ├── aws-architecture-decision-engine.md  # Questionnaire → decisions
│   ├── aws-app-platform-questionnaire.md    # 12-question platform design
│   ├── aws-platform-blueprint-for-app.md   # Full platform design prompt
│   ├── tagging-compliance.yaml       # Mandatory tag set
│   └── samples/                       # Sample repos and reports
│
├── aws-architecture-pattern-advisor   # Service selection, anti-patterns
├── aws-federal-grade-checklist        # Federal-grade evaluation (NIST, FedRAMP, DoD)
├── nist-compliance-evaluator          # NIST, Zero Trust, CIS, FedRAMP
├── observability-grafana-advisor      # CloudWatch, Grafana, Golden Signals
├── finops-cost-optimizer              # Cost optimization, savings
├── security-review                   # IAM, secrets, encryption
├── networking-review                 # VPC, subnets, SGs, NAT
└── devops-review                     # CI/CD, GitOps
```

---

## Frameworks

| Framework | Scope |
|-----------|-------|
| **AWS Well-Architected** | 6 pillars; primary architecture framework |
| **NIST / CIS** | NIST 800-53, 800-207 (Zero Trust), CIS Benchmarks |
| **Federal-grade** | aws-federal-grade-checklist (FedRAMP, DoD DevSecOps) |
| **FinOps** | Cost optimization, tagging, cost allocation |
| **Observability** | SRE Golden Signals, CloudWatch, DORA |

---

## Usage

**Repo-Driven:**
```
Review my application repo for AWS Well-Architected compliance.
Focus on security, cost, and reliability.
```

**Spec-Driven:**
```
Design an AWS platform for a web app. I'll answer the questionnaire.
```

**Invocation:**
```
Run a full cloud architecture review on my repository.
Use the cloud-architecture-ai-auditor system.
```

---

## AWS Scope

This repo is **AWS-only**. No Azure or GCP logic. See [AWS-SCOPE.md](AWS-SCOPE.md).

---

## Key Files

| File | Purpose |
|------|---------|
| `AWS-SCOPE.md` | AWS-only scope; no Azure/GCP |
| `CONTRIBUTING.md` | Contribution guidelines |
| `CHANGELOG.md` | Version history |
| `LICENSE` | MIT |
| `cloud-architecture-ai-auditor/README.md` | Full system documentation |
| `cloud-architecture-ai-auditor/orchestrator-prompt.md` | Coordination prompt |
| `cloud-architecture-ai-auditor/OPERATING_MODES.md` | Mode selection |
| `cloud-architecture-ai-auditor/RULES.md` | Project rules |
| `RULES.md` | Rule-based routing |
| `review-workflow.md` | Structured workflow |

---

## End Goal

This repository is the **AWS-first, production-grade platform design and review system** in the LongTheta ecosystem — supporting both evaluation of existing implementations and design of new platforms from scratch.
