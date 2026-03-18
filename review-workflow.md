# AWS Repo Well-Architected Advisor — Review Workflow

Structured workflow prompts for repo analysis and architecture guidance. Rule-driven; no agent dependency.

---

## Workflow: Repo Review

Use when the developer requests a repo review.

```
Review this repository. Use rule-based skill selection per RULES.md and skill-trigger-matrix.yaml:

1. Inventory repo contents (IaC, K8s, CI/CD, containers, configs)
2. Match contents against file triggers; resolve skills to use
3. Apply skills in priority order (security first)
4. Merge duplicate findings; tag evidence (Observed / Inferred / Missing Evidence / Contradictory Evidence)

Use only skills that match repo contents. Do not run every skill.
```

---

## Workflow: Security Review

Use when the developer requests a security-focused review.

```
Security review of this repository. Use security-evaluator. If IaC present, add ai-devsecops-policy-enforcement. If K8s/GitOps present, add zero-trust-gitops-enforcement and dod-zero-trust-architect. Tag evidence. Merge duplicates.
```

---

## Workflow: Tool Evaluation

Use when the developer requests tool or platform evaluation.

```
Evaluate [tool/platform]. Use tool-evaluator skill. Assess adoption fit, risk, implementation burden.
```

---

## Workflow: New Rule

Use when the developer requests a new rule.

```
Create a rule for [purpose]. Use create-rule skill.
```

---

## Workflow: New Skill

Use when the developer requests a new reusable capability.

```
Create a skill for [capability]. Use create-skill skill.
```

---

## Workflow: Decompose Work

Use when the developer requests to split work into specialist workflows.

```
Decompose this work into specialist workflows. Use create-subagent skill.
```

---

## Playbook Reference

| Repo Type | Skills |
|-----------|--------|
| IaC | security-evaluator, ai-devsecops-policy-enforcement, tool-evaluator |
| Kubernetes / GitOps | zero-trust-gitops-enforcement, dod-zero-trust-architect, security-evaluator |
| CI/CD | ai-devsecops-policy-enforcement, zero-trust-gitops-enforcement, security-evaluator |
| Containerized apps | cve-detect-and-remediate, security-evaluator |
| Security review | security-evaluator (+ others per repo contents) |
| Tool/platform decision | tool-evaluator |

---

## References

- `RULES.md` — Routing rules and playbook
- `skill-trigger-matrix.yaml` — File patterns and conditions
