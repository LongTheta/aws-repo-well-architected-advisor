# Drift Detection

Configuration drift between repository intent and deployed AWS state.

## What Is Implemented

- **IaC vs deployed** — Compare repo-defined resources to live inventory (requires AWS credentials)
- **Repo vs state file** — Compare to a deployed state JSON (no credentials)
- **CloudFormation drift** — Ingest CloudFormation drift detection results
- **Partial mode** — Report when only repo data available (`verification_status: cannot_verify`)

## Verification Status

| Status | Meaning |
|--------|---------|
| `cannot_verify` | No credentials or partial data; cannot compare |
| `no_drift_observed` | Comparison completed; no drift |
| `drift_detected` | Drift found |

## Usage

```bash
# Compare repo to deployed state (requires AWS credentials)
python scripts/detect_drift.py --repo . --region us-east-1

# Compare repo to state file
python scripts/compare_repo_to_state.py --repo . --state deployed-state.json

# Partial mode (repo only)
python scripts/compare_repo_to_state.py --repo .
```

## What Requires AWS Credentials

- `detect_drift.py` with live comparison
- CloudFormation drift ingestion

## Safety

- No destructive actions
- No implied compliance claims
- No silent assumptions
