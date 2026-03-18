# AWS Repo Well-Architected Advisor — Rule-Based Skill Routing

Rules that map repo contents and user requests to specific skills. Deterministic, maintainable, no agent dependency.

**Scope:** AWS only. See `AWS-SCOPE.md`. Primary system: `cloud-architecture-ai-auditor/` with Repo-Driven and Spec-Driven modes.

---

## Model

- **Skills** — Reusable expertise modules (security-evaluator, tool-evaluator, cve-detect-and-remediate, etc.)
- **Rules** — Conditions that trigger skill usage (file patterns, repo signals)
- **Prompts** — Structured workflows for the developer (see `review-workflow.md`)

---

## Output Standards

- **Prioritize security findings** — Security-critical issues first
- **Merge duplicate findings** — Combined evidence, strongest severity, cross-framework mapping
- **Tag evidence** — Observed / Inferred / Missing Evidence / Contradictory Evidence
- **Match skills to repo** — Use only relevant skills; avoid running every skill

## aws-federal-grade-checklist Rules

- **Critical findings** — If aws-federal-grade-checklist returns any critical finding → mark as **NOT READY**
- **High findings** — If it returns high findings → require remediation before recommending production readiness
- **Missing required tags** — Treated as governance failure; must be remediated
- **Missing evidence** — Must NOT be treated as compliant; flag explicitly and may raise risk

---

## Rule-Based Skill Routing

### File Pattern → Skills

| Repo Contains | Skills |
|---------------|--------|
| IaC (`*.tf`, `terragrunt.hcl`, `cdk.json`, CloudFormation) | security-evaluator, ai-devsecops-policy-enforcement, tool-evaluator |
| Kubernetes, Helm, ArgoCD, Kustomize | zero-trust-gitops-enforcement, dod-zero-trust-architect, security-evaluator |
| Dockerfiles, dependency manifests | cve-detect-and-remediate, security-evaluator |
| CI/CD (`.gitlab-ci.yml`, GitHub Actions, Jenkins) | ai-devsecops-policy-enforcement, zero-trust-gitops-enforcement, security-evaluator |

### User Request → Skills

| User Request | Skill |
|--------------|-------|
| Tool or platform evaluation | tool-evaluator |
| New rule (repo-wide behavior) | create-rule |
| New skill (reusable capability) | create-skill |
| Decompose work into specialist workflows | create-subagent |

---

## Repo Review Playbook

Defines which skills to use for each repo type.

### IaC Repos

**Signals:** Terraform, Terragrunt, CDK, CloudFormation

**Skills:** security-evaluator, ai-devsecops-policy-enforcement, tool-evaluator

**Focus:** Pipeline security, policy compliance, service selection

---

### Kubernetes / GitOps Repos

**Signals:** K8s manifests, Helm charts, ArgoCD, Kustomize

**Skills:** zero-trust-gitops-enforcement, dod-zero-trust-architect, security-evaluator

**Focus:** Zero Trust alignment, GitOps promotion controls, manifest security

---

### CI/CD Repos

**Signals:** `.gitlab-ci.yml`, `.github/workflows/`, Jenkinsfile, buildspec

**Skills:** ai-devsecops-policy-enforcement, zero-trust-gitops-enforcement, security-evaluator

**Focus:** Pipeline security, supply chain, promotion gates

---

### Containerized Apps

**Signals:** Dockerfile, docker-compose, package.json, requirements.txt, go.mod, Cargo.toml

**Skills:** cve-detect-and-remediate, security-evaluator

**Focus:** Dependency vulnerabilities, container hardening

---

### Security Reviews

**Signals:** Any repo with security-sensitive config (IAM, networking, secrets)

**Skills:** security-evaluator (always when security signals present)

**Focus:** IAM, encryption, exposure, audit trails

---

### Tool / Platform Decisions

**Signals:** User requests tool comparison, vendor selection, technology evaluation

**Skills:** tool-evaluator

**Focus:** Adoption fit, risk, implementation burden

---

## References

- `skill-trigger-matrix.yaml` — File patterns and conditions → skills
- `review-workflow.md` — Structured workflow prompts
- `.cursorrules` — Condensed rules for Cursor
