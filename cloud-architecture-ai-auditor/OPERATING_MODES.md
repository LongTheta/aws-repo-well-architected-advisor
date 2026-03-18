# Cloud Architecture AI Auditor — Operating Modes

The system supports two operating modes. Select based on whether the user provides repos or requirements.

---

## Mode Selection Logic

| Condition | Mode | Behavior |
|-----------|------|----------|
| Repo files are present | **Repo-Driven** | Analyze existing code; infer architecture; produce audit report |
| Only requirements or questions | **Spec-Driven** | Design platform from scratch; act as product manager + solutions architect |
| Both repo and requirements | **Repo-Driven first, then refine** | Run Repo-Driven; refine using Spec-Driven inputs |

---

## Mode 1 — Repo-Driven

**Trigger when:** Repos are provided; user asks for analysis, review, or improvements.

### Artifacts Inspected

Terraform, CDK, CloudFormation, Docker, CI/CD (GitHub Actions, GitLab CI, CodeBuild), Kubernetes manifests.

### Behavior

1. Run repo discovery
2. Infer current-state AWS architecture from artifacts
3. Identify gaps:
   - Networking (VPC, subnets, NAT, endpoints)
   - IAM (roles, policies, least privilege)
   - Secrets (hardcoded creds, Secrets Manager, Parameter Store)
   - Compute/runtime fit (Lambda vs ECS vs EKS vs EC2)
   - Observability (logs, metrics, traces, alarms)
   - Tagging (required tag set)
   - Cost posture (NAT, over-provisioning, cheaper alternatives)
4. Generate:
   - Current-state architecture
   - Findings
   - Improved platform recommendation

### Output

- Audit-style report
- Remediation backlog
- Optimized architecture

### Skills

- repo-discovery
- architecture-inference
- well-architected-scoring-engine
- aws-architecture-pattern-advisor
- nist-compliance-evaluator
- finops-cost-optimizer
- devops-operability-review
- observability-grafana-advisor

---

## Mode 2 — Spec-Driven

**Trigger when:** No repo is provided; user asks to design a system; user provides requirements or answers questions.

### Behavior

1. Run application questionnaire (`aws-app-platform-questionnaire`)
2. Interpret requirements
3. Design:
   - AWS platform from scratch
   - Cost-effective baseline
   - Security baseline
   - Observability setup
4. Provide:
   - Service selection
   - Architecture diagram (text)
   - Cost estimate
   - Growth path

### Output

- Platform blueprint
- Architecture decisions
- Implementation plan

### References

- `aws-app-platform-questionnaire.md` — Collect answers
- `aws-architecture-decision-engine.md` — Convert answers → architecture decisions (rule-based)
- `aws-platform-blueprint-for-app.md` — Full platform design

---

## Shared Rules (Both Modes)

- Default to cheapest safe architecture
- Enforce tagging strategy
- Avoid over-engineering
- Prefer managed services
- Do not recommend EKS unless justified
- Include cost vs reliability tradeoffs
- Include upgrade path

---

## Output Consistency (Both Modes)

Both modes must produce:

| Section | Repo-Driven | Spec-Driven |
|---------|-------------|-------------|
| Executive summary | ✓ | ✓ |
| Architecture | Current-state (inferred) | Proposed (designed) |
| Cost snapshot | ✓ | ✓ |
| Security baseline | ✓ | ✓ |
| Observability plan | ✓ | ✓ |
| Risks | ✓ | ✓ |
| Recommendations | ✓ | ✓ |

---

## Invocation Examples

### Repo-Driven

```
Review my repository. Analyze the architecture and recommend improvements.
```

### Spec-Driven

```
Design an AWS platform for a web app. I'll answer the questionnaire.
```

### Both

```
I have a repo and requirements. Review the repo first, then refine the design based on my answers.
```

---

## End Goal

Create a system that can both:

- **Evaluate existing implementations** (Repo-Driven)
- **Design new platforms from scratch** (Spec-Driven)

Like a real-world solutions architect working with both code and requirements.
