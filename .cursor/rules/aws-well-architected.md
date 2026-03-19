---
description: AWS Well-Architected Pack — evidence-based architecture review
globs: ["**/*.tf", "**/*.tfvars", "**/*.yaml", "**/*.yml", "**/Dockerfile", "**/.github/**"]
alwaysApply: false
---

- Use skills/aws-well-architected-pack for AWS architecture review
- Evidence tags: Observed, Inferred, Missing Evidence
- Never assume compliance without evidence
- Run repo-discovery → architecture-inference → security-review → scoring
- Output per schemas/review-score.schema.json
