# Contributing to AWS Repo Well-Architected Advisor

Thank you for your interest in contributing. This repo is the AWS-first platform design and review system for the LongTheta ecosystem.

---

## Scope

- **AWS only.** No Azure or GCP logic. See [AWS-SCOPE.md](AWS-SCOPE.md).
- **Operating modes:** Repo-Driven (analyze existing code) and Spec-Driven (design from requirements).
- **Frameworks:** AWS Well-Architected, NIST/CIS, FinOps, observability.

---

## How to Contribute

### 1. Report Issues

- Use GitHub Issues for bugs, gaps, or feature requests.
- Include: repo type, operating mode, expected vs actual behavior.
- For Repo-Driven: describe the repo structure and artifacts.
- For Spec-Driven: include questionnaire answers if relevant.

### 2. Propose Changes

- Open a Pull Request from a feature branch.
- Keep PRs focused; one concern per PR.
- Update documentation when adding rules, prompts, or decision logic.
- Ensure YAML/JSON is valid.

### 3. Add or Update Rules

- **Decision logic:** Update `aws-architecture-decision-engine.md` or `aws-decision-engine.md`.
- **Tagging:** Update `cloud-architecture-ai-auditor/tagging-compliance.yaml`.
- **Output format:** Update `output-consistency-rules.yaml` and `report-template.md`.
- **Skill triggers:** Update `skill-trigger-matrix.yaml`.

### 4. Add Samples

- Sample repos go in `cloud-architecture-ai-auditor/samples/`.
- Sample reports must conform to `finding-schema.yaml` and `output-consistency-rules.yaml`.
- Include both Repo-Driven and Spec-Driven examples when relevant.

---

## Conventions

- **Evidence tags:** Observed / Inferred / Missing Evidence / Contradictory Evidence
- **Severity:** Critical / High / Medium / Low
- **EKS:** Do not recommend unless justified. Document justification in decision logic.
- **Tagging:** All 8 required tags must be enforced. See `tagging-compliance.yaml`.

---

## Structure

```
cloud-architecture-ai-auditor/   # Core orchestration
├── operating-modes.yaml        # Repo-Driven vs Spec-Driven
├── aws-architecture-decision-engine.md
├── tagging-compliance.yaml
└── samples/
```

Specialist skills (aws-architecture-pattern-advisor, nist-compliance-evaluator, etc.) live as sibling directories.

---

## Questions

Open an issue with the `question` label or reach out to the maintainers.
