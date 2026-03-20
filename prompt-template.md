# Invocation Prompt Template

Use this template when requesting an AWS Well-Architected review. Fill in the placeholders; omit sections that do not apply.

---

**Request**: Run an AWS Well-Architected review on my repository.

**Repository path**: [e.g., `.` or `path/to/repo`]

**Focus areas** (optional): [e.g., security, cost, reliability, networking, all]

**Persona** (optional): [Solutions Architect / Developer-Platform Engineer / Security Engineer / all]

**Context** (optional):
- Environment: [dev / stage / prod / multi]
- AWS services in use: [e.g., ECS, RDS, S3, Lambda]
- Compliance requirements: [e.g., none, FedRAMP, HIPAA, NIST, CIS]
- Known constraints: [e.g., single account, budget limits]
- Frameworks of interest: [AWS only / CompTIA Cloud+ / NIST-CIS / FinOps / all]

**Output preference** (optional): [Full report / Executive summary only / Findings by pillar / Multi-framework scorecard only]

---

## Example Invocations

**Minimal**:
```
Review my repo for AWS Well-Architected compliance.
```

**Focused**:
```
Run an AWS Well-Architected review on ./infrastructure. 
Focus on security and cost. I'm a Security Engineer.
```

**Detailed**:
```
Review my application repo for AWS Well-Architected alignment.
- Repo: ./
- Focus: security, reliability, cost
- We use Terraform, ECS Fargate, RDS
- Target: production readiness
- Include remediation plan with effort estimates
```

**Multi-repo (TaskForge stack)** — run from taskforge-platform-infra:
```
Assess the TaskForge stack: read taskforge-backend and taskforge-security, infer the full architecture, produce recommendations, and update this repo with assessments and Terraform patches.
```

**App repo not ready for Terraform** — creates `{app-name}-platform-infra` with fixes stubs:
```
Assess [app-repo-path]. Create {app-repo-name}-platform-infra with README ("You need to fix these"), docs/assessment/, and fixes/ (one stub per finding). No Terraform until app meets baseline. Follow docs/core-ai-guidance.md § Consistent Workflow.
```
