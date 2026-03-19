# Native Tools — Design Specs

Tool contracts for OpenCode integration. Implement as plugin tools or standalone scripts.

## Tools

| Tool | Purpose | Called By |
|------|---------|-----------|
| [review-score](review-score.md) | Compute weighted score from category scores | /repo-assess, /verify, /quality-gate |
| [quality-gate-check](quality-gate-check.md) | Check if quality gate passed | Pre-push, /quality-gate |
| [evidence-extractor](evidence-extractor.md) | Extract evidence tags from findings | /verify |
| [federal-control-mapper](federal-control-mapper.md) | Map finding to NIST control family | /federal-checklist |
| [target-architecture-synthesizer](target-architecture-synthesizer.md) | Synthesize target architecture from constraints | /platform-design |

## Schema References

- `schemas/review-score.schema.json`
- `skills/aws-well-architected-pack/scoring/scoring-model.md`
