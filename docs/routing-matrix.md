# Routing Matrix

Command → Agent → Skills → Output Schema

| Command | Agent | Primary Skills | Output Schema |
|---------|-------|----------------|---------------|
| /repo-assess | repo-auditor | repo-discovery, architecture-inference, security, networking, observability | review-score |
| /solution-discovery | product-manager-discovery | (agent-driven) | solution-brief |
| /platform-design | cloud-platform-reviewer | repo-discovery, architecture-inference, aws-architecture-pattern-review | target-architecture |
| /federal-checklist | federal-security-reviewer | compliance-evidence-review, security-review | review-score |
| /gitops-audit | gitops-reviewer | devops-operability-review, observability-review, security-review | review-score |
| /quality-gate | repo-auditor | full pipeline | review-score + quality-gate-result.json |
| /doc-sync | documentation-writer | architecture-inference | (none) |
| /verify | repo-auditor | evidence-extractor | verification report |
| /checkpoint | repo-auditor | (state summary) | (none) |
| /orchestrate | repo-auditor | full pipeline | review-score |

## File Pattern → Command Suggestion

| File Pattern | Suggested Command |
|--------------|-------------------|
| **/*.tf, **/*.tfvars | /repo-assess, /quality-gate |
| .github/workflows/**, .gitlab-ci.yml | /gitops-audit |
| **/argocd/**, **/k8s/** | /gitops-audit, /federal-checklist |
| docs/architecture.md missing + infra changed | /doc-sync |

## User Intent → Command

| Intent | Command |
|--------|---------|
| "review this repo" | /repo-assess |
| "production ready?" | /quality-gate |
| "federal compliance" | /federal-checklist |
| "design platform" | /platform-design |
| "sync docs" | /doc-sync |
| "verify findings" | /verify |
