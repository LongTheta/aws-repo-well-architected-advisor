# Execution Model

How the AWS Repo Well-Architected Advisor runs at scale: multi-repo, CI integration, batching, rate limiting, retries, failure handling, and artifact storage.

---

## Overview

The advisor supports:

- **Single-repo mode**: Run against one repository (default)
- **Batch mode**: Process multiple repos with structured outputs per repo
- **CI integration**: Run as a GitHub Action, GitLab CI job, or pre-push hook

---

## Multi-Repo Execution

### How to Run Against Multiple Repos

1. **Batch runner script** (optional): `python scripts/batch_runner.py --repos repos.txt`
2. **Manifest format**: One repo path or URL per line in `repos.txt`
3. **Output**: One directory per repo under `output/<repo-slug>/` containing:
   - `architecture_graph.json`
   - `cost_analysis.json`
   - `workload_profile.json`
   - `decision_log.json`
   - `review_output.json` (if assessment run)

### Parallelism

- Default: sequential processing
- With `--parallel N`: up to N repos processed concurrently
- Each run is isolated (no shared state)

---

## CI Integration Model

### GitHub Actions

```yaml
- name: Well-Architected Review
  run: |
    npm ci
    python scripts/build_architecture_graph.py --scenario examples/scenarios/startup-workload.json
    python scripts/graph_to_mermaid.py examples/architecture-graph-built.json
    python scripts/validate_mermaid.py examples/architecture-graph-built.json
    node tests/scenarios/run-scenarios.js
```

### GitLab CI

```yaml
well-architected:
  script:
    - npm ci
    - python3 scripts/validate_mermaid.py examples/architecture-graph-example.json
    - npm run validate:schemas
    - node tests/scenarios/run-scenarios.js
```

### Pre-Push Hook

- Use `hooks/pre-push` to run schema validation and diagram checks before push
- Fails push if: schema validation fails, diagram invalid, or workload_profile/cost_analysis missing

---

## Batching Strategy

1. **Input**: List of repo paths or URLs
2. **Chunk size**: Process in chunks of 5–10 repos to limit memory
3. **Order**: Deterministic (alphabetical by path) for reproducibility
4. **Output**: Write artifacts to `output/<repo-slug>/` immediately after each repo

---

## Rate Limiting Strategy

- **No external API calls** in core flows (cost is heuristic, no live AWS pricing)
- If future AWS API integration: use exponential backoff, max 10 req/s per account
- For OpenCode/LLM calls: respect provider rate limits (configurable in opencode.json)

---

## Retry Logic

- **Schema validation**: No retry (deterministic)
- **Diagram generation**: No retry (deterministic)
- **Batch runner**: On failure for repo N, log error, continue with repo N+1
- **Optional**: `--retry-failed` to re-run only failed repos from a previous batch

---

## Failure Handling

| Failure Type | Behavior |
|--------------|----------|
| Schema validation fails | FAIL build; do not proceed |
| Diagram not from graph | FAIL build |
| Missing workload_profile | FAIL build |
| Missing cost_analysis | FAIL build |
| Missing decision_log | FAIL build |
| Single repo in batch fails | Log, continue; report failed repos at end |
| Script crash | Exit code 1; batch runner continues with next repo |

---

## Artifact Storage Model

### Single Repo

- Outputs written to `examples/` or user-specified path
- `architecture-graph-built.json`, `cost-estimate-output.json`

### Batch Mode

```
output/
  repo-a/
    architecture_graph.json
    cost_analysis.json
    workload_profile.json
    decision_log.json
  repo-b/
    ...
```

### CI Artifacts

- Upload `output/` as job artifact (GitHub Actions: `actions/upload-artifact`)
- Retention: 7–30 days (configurable)

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `OPENCODE_CONFIG` | Path to opencode.json |
| `AWS_REPO_ADVISOR_OUTPUT` | Override output directory |
| `BATCH_PARALLEL` | Max parallel repos (batch mode) |

---

## Next Improvements

- Real AWS Pricing API integration
- Deeper Terraform/CDK parsing
- Multi-account modeling
- Caching of architecture graphs for unchanged repos
