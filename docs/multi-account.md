# Multi-Account / Control Tower Modeling

AWS Organizations and Control Tower landing zone topology.

## What Is Implemented

- **Single-account** — One account for all environments
- **Multi-account** — Shared services, security, workload accounts
- **Control Tower** — Audit, log archive, enrolled accounts, guardrails

## Model Captures

- Management account
- Audit and log archive accounts
- Workload OUs and environment mapping
- Cross-account roles
- Logging topology
- Guardrail context (preventive, detective)

## Usage

```bash
python scripts/build_org_topology.py --mode single
python scripts/build_org_topology.py --mode multi-account
python scripts/build_org_topology.py --mode control-tower
python scripts/build_org_topology.py --config org-config.json
```

## Output

When multi-account mode is enabled, architecture outputs can include:

- `org_topology` — Account placement, OUs, roles
- Role trust boundaries
- Artifact and log aggregation locations
- Drift and compliance monitoring boundaries
