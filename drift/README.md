# Drift Detection Module

Detect configuration drift between repository intent and deployed AWS state.

## Drift Modes

1. **IaC intended state vs deployed state** — Compare repo-defined resources to live inventory
2. **CloudFormation drift** — Ingest native CloudFormation drift detection results
3. **Governance drift** — Summary for Control Tower / AWS Config contexts

## Usage

```bash
# Compare repo to deployed state (requires AWS credentials)
python scripts/detect_drift.py --repo . --region us-east-1

# Compare repo resources to state file
python scripts/compare_repo_to_state.py --repo . --state deployed-state.json
```

## Verification Status

- **cannot_verify** — No credentials or partial data
- **no_drift_observed** — Comparison completed, no drift
- **drift_detected** — Drift found

## Safety

- No destructive actions
- No implied compliance claims
- No silent assumptions
