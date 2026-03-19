# Command-to-Skill Mapping

Deterministic mapping from commands to skill graphs.

## /repo-assess

```
repo-discovery
  → architecture-inference
  → security-review
  → networking-review
  → observability-review
  → scoring (review-score)
  → report (report-template)
```

## /solution-discovery

```
product-manager-discovery (agent-driven)
  → requirements synthesis
  → solution brief
```

No skill modules; agent uses discovery prompts.

## /platform-design

```
repo-discovery
  → architecture-inference
  → aws-architecture-pattern-review
  → constraints synthesis
  → reference architecture
  → decision log
```

## /federal-checklist

```
repo-discovery
  → architecture-inference
  → evidence extraction
  → compliance-evidence-review (control-family mapping)
  → security-review
  → readiness report
```

## /gitops-audit

```
repo-discovery
  → architecture-inference
  → devops-operability-review
  → observability-review
  → security-review (CI/CD)
  → scoring
  → report
```

## /quality-gate

Same as /repo-assess, plus:
- Write .opencode/quality-gate-result.json
- Set session qualityGatePassed when READY or CONDITIONAL

## /doc-sync

```
architecture-inference (from current repo)
  → documentation-writer (agent)
  → update docs/architecture.md
```

## /verify

```
evidence-extractor (on findings)
  → schema validation (review-score.schema.json)
  → verification report
```

## /checkpoint

```
Summarize current state:
  - artifacts from repo-discovery
  - architecture from inference
  - findings so far
  - scores
```

## /orchestrate

Full pipeline in phases:
1. repo-discovery
2. architecture-inference
3. security-review, networking-review, reliability-resilience-review, devops-operability-review, finops-cost-review, observability-review, compliance-evidence-review
4. scoring
5. report
