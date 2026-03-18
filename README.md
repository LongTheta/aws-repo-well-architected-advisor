# AWS Repo Well-Architected Advisor

An AI skill that reviews application repositories, infrastructure-as-code, CI/CD pipelines, Kubernetes manifests, and deployment configs using a **multi-framework evaluation layer** combining AWS Well-Architected, CompTIA Cloud+, NIST/CIS security controls, DevOps maturity, and FinOps cost optimization.

## Cloud Architecture AI Auditor (Full System)

For a **comprehensive cloud architecture review**, use the [cloud-architecture-ai-auditor](cloud-architecture-ai-auditor/) system. It applies specialist skills and produces a consulting-grade report:

```
cloud-architecture-ai-auditor/
├── well-architected-scoring-engine   # Report synthesis
├── repo-discovery
├── architecture-inference
├── devops-operability-review
└── [references sibling skills: aws-architecture-pattern-advisor, nist-compliance-evaluator, etc.]
```

## Overview

This skill applies a **5-layer evaluation model** — an automated cloud architecture review engine with enterprise + federal alignment:

| Layer | Framework | What It Covers |
|-------|-----------|----------------|
| 1 | **AWS Well-Architected** | Cloud design best practices (6 pillars) |
| 2 | **CompTIA Cloud+** | Operational best practices — can it run in production? Is it maintainable? |
| 3 | **Security / Compliance** | NIST, CIS, OWASP alignment |
| 4 | **DevOps Maturity** | CI/CD, GitOps, observability |
| 5 | **FinOps** | Cost efficiency, resource utilization |

**CompTIA Cloud+** maps to CV0-004 domains (Architecture, Security, Deployment, Operations, Troubleshooting, DevOps) and 8 best practices. **RTO/RPO, restore testing, and troubleshooting visibility** are flagged hard when missing — common gaps in most repos.

All findings are tagged as **Observed** / **Inferred** / **Missing Evidence**.

## Key Features

- **5-layer evaluation** — AWS, CompTIA, Security/Compliance, DevOps, FinOps
- **CompTIA Cloud+ CV0-004** — Maps to Architecture, Security, Deployment, Operations, Troubleshooting, DevOps
- **CompTIA 8 best practices** — IaC, CI/CD, Backup/DR (RTO/RPO + restore testing), Networking, Security, Monitoring, Cost, Troubleshooting
- **Flag hard** — RTO/RPO, restore testing, and troubleshooting visibility (common gaps)
- **Additional frameworks** — OWASP (Top 10, API Security), CIS, Kubernetes best practices, DORA signals
- **Evidence-based findings** — Every finding tagged: Observed / Inferred / Missing Evidence
- **Role-based output** — Findings for Architect, Developer, Security
- **Compliance gaps** — NIST/CIS control mapping with remediation
- **Cost-effective target architecture** — Quick wins, medium-term, strategic

## When to Use

- Review AWS workloads, Terraform, CDK, CloudFormation, EKS, ECS, Lambda configs
- Assess VPC design, IAM posture, cost optimization, security compliance
- Evaluate Well-Architected, CompTIA Cloud+, NIST, CIS, or FinOps alignment
- Get role-specific guidance for architecture, development, or security teams

## Review Modules

| Module | Purpose |
|--------|---------|
| Repo Discovery | Inventory IaC, CI/CD, K8s manifests, deployment configs |
| Architecture Inference | Infer current-state AWS architecture from artifacts |
| Networking Review | VPC, ingress/egress, hybrid connectivity |
| IAM/Security Review | Roles, trust boundaries, secrets, encryption |
| Reliability/Resilience Review | Multi-AZ, DR, failover, health checks |
| Performance/Cost Review | Compute, storage, cost drivers, optimization |
| DevOps/Operability Review | CI/CD, logging, metrics, tracing, tagging |
| CompTIA Cloud+ Review | 7 operational validation checks |
| Multi-Framework Scoring | Aggregate scores, compliance gaps, final report |

## Output

1. Executive summary  
2. Inferred architecture  
3. Multi-framework scorecard (AWS pillars + CompTIA, Security, DevOps, FinOps)  
4. Top 10 risks (with evidence tags)  
5. Role-based findings (Architect, Developer, Security)  
6. Prioritized remediation backlog  
7. Cost-effective target architecture  
8. Compliance gaps (NIST/CIS)  
9. Suggested next implementation steps by repo  

## Scoring

- **AWS pillars**: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability
- **Framework scores**: CompTIA operational, Security/Compliance, DevOps maturity, Cost optimization (FinOps)
- **Severity**: Critical / High / Medium / Low
- **Confidence**: Confirmed / Strongly Inferred / Assumed
- **Evidence**: Observed / Inferred / Missing Evidence

## Rule-Based Skill Routing

Rule-driven skill selection per `RULES.md` and `skill-trigger-matrix.yaml`:

- **Skills** — Reusable expertise modules
- **Rules** — File patterns and user requests trigger specific skills
- **Prompts** — Structured workflows (see `review-workflow.md`)

| Repo Type | Skills |
|------------|--------|
| IaC | security-evaluator, ai-devsecops-policy-enforcement, tool-evaluator |
| Kubernetes / GitOps | zero-trust-gitops-enforcement, dod-zero-trust-architect, security-evaluator |
| CI/CD | ai-devsecops-policy-enforcement, zero-trust-gitops-enforcement, security-evaluator |
| Containerized apps | cve-detect-and-remediate, security-evaluator |

## Files in This Skill

| File | Purpose |
|------|---------|
| `RULES.md` | **Rule-based routing** — conditions that trigger skills |
| `.cursorrules` | Condensed rules for Cursor |
| `skill-trigger-matrix.yaml` | File patterns and requests → skills |
| `review-workflow.md` | Structured workflow prompts |
| `SKILL.md` | Main skill instructions |
| `README.md` | This overview |
| `prompt-template.md` | Invocation prompt template |
| `reference.md` | Skill definition, module specs, dimension details |
| `scoring-rubric.md` | Per-pillar scoring criteria |
| `sample-input-repo-structure.md` | Expected repo layout for review |
| `sample-output-report.md` | Full example report |
| `production-readiness-checklist.md` | Pre-production checklist |

## Skill Hierarchy

```
aws-repo-well-architected-advisor
│
├── aws-architecture-pattern-advisor — Service selection, anti-patterns, right-sizing
├── nist-compliance-evaluator       — NIST 800-53, Zero Trust, CIS, FedRAMP
├── observability-grafana-advisor   — Grafana dashboards, Golden Signals, DORA
├── finops-cost-optimizer           — Cost optimization, FinOps, savings
├── security-review                — IAM, secrets, encryption, compliance
├── networking-review               — VPC, subnets, SGs, NAT, hybrid
└── devops-review                   — CI/CD, GitOps, observability
```

## Specialist Skills

| Skill | Purpose |
|-------|---------|
| [aws-architecture-pattern-advisor](aws-architecture-pattern-advisor/) | Service selection (Lambda/ECS/EKS/EC2), anti-patterns, right-sized architecture |
| [nist-compliance-evaluator](nist-compliance-evaluator/) | NIST 800-53, 800-207 (Zero Trust), 800-190, CIS; FedRAMP readiness |
| [observability-grafana-advisor](observability-grafana-advisor/) | Grafana dashboards, SRE Golden Signals, DORA, GitOps telemetry |
| [finops-cost-optimizer](finops-cost-optimizer/) | Cost inefficiencies, FinOps, savings opportunities |
| [security-review](security-review/) | IAM, secrets, encryption, audit |
| [networking-review](networking-review/) | VPC, subnets, security groups, NAT, VPC endpoints |
| [devops-review](devops-review/) | CI/CD, GitOps, deployment safety, observability |

## Installation

This skill is stored in `~/.cursor/skills/aws-repo-well-architected-advisor/`. Cursor loads it automatically when the description matches your request (e.g., "review my AWS repo for Well-Architected compliance").

## Usage Example

```
Review my application repo for AWS Well-Architected compliance. 
Focus on security, cost, and reliability. I'm a Solutions Architect.
```

Apply the skill, run the review modules, and produce the structured report.
